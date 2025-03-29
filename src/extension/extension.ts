// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import path = require('path')
import * as crypto from 'crypto'
import * as vscode from 'vscode'
import {
  adjustSpeedForScale,
  generatePet,
  mutateLevel,
  petTypes,
  randomPetName,
  randomPetType,
  UserPet,
} from '../panel'

// Define position type to avoid string comparison issues
type Position = 'panel' | 'explorer'

/**
 * Global state for managing the single pet across views
 */
class PetState {
  // The single pet instance used throughout the extension
  private static _pet: UserPet | undefined

  // A flag to track if we're in the middle of a view switch
  private static _isViewSwitching = false

  // Get the current pet, creating one if needed
  static getPet(context: vscode.ExtensionContext): UserPet {
    if (!this._pet) {
      this._pet = this.loadFromStorage(context)
    }
    return this._pet
  }

  // Save the current pet to storage
  static savePet(context: vscode.ExtensionContext): Thenable<void> {
    if (this._pet) {
      return context.globalState.update('pets', [this._pet])
    }
    return Promise.resolve()
  }

  // Update the pet with a new state
  static updatePet(pet: UserPet, context: vscode.ExtensionContext) {
    this._pet = pet
    return this.savePet(context)
  }

  // Create a new random pet
  static createNewPet(context: vscode.ExtensionContext): UserPet {
    const scaleFactor = vscode.workspace
      .getConfiguration()
      .get('codachi.scaleFactor', 1.0)

    const pet = generatePet({
      type: randomPetType(),
      name: randomPetName(),
    })

    pet.scale = scaleFactor
    pet.isTransitionIn = true

    if (pet.speed) {
      pet.originalSpeed = pet.speed
    }

    this._pet = pet
    this.savePet(context)
    return pet
  }

  // Load pet from storage or create a new one
  private static loadFromStorage(context: vscode.ExtensionContext): UserPet {
    const storedPets = context.globalState.get('pets') as UserPet[] | undefined

    if (!storedPets || storedPets.length === 0) {
      return this.createNewPet(context)
    }

    const pet = storedPets[0] // Only supporting a single pet for now

    // Ensure originalSpeed is set for stored pets
    if (!pet.originalSpeed && pet.speed) {
      pet.originalSpeed = pet.speed
    }

    // Apply current scale factor to existing pet
    const scaleFactor = vscode.workspace
      .getConfiguration()
      .get('codachi.scaleFactor', 1.0)
    pet.scale = scaleFactor

    return pet
  }

  // Set flag when switching view modes
  static setViewSwitching(isViewSwitching: boolean) {
    this._isViewSwitching = isViewSwitching
  }

  // Check if we're in the middle of a view switch
  static isViewSwitching(): boolean {
    return this._isViewSwitching
  }
}

/**
 * Returns the current position setting (panel or explorer)
 */
function getConfigurationPosition(): Position {
  return vscode.workspace
    .getConfiguration('codachi')
    .get<Position>('position', 'panel')
}

/**
 * Updates the VS Code context with the current position
 */
async function updateExtensionPositionContext() {
  await vscode.commands.executeCommand(
    'setContext',
    'codachi.position',
    getConfigurationPosition()
  )
}

/**
 * Base class for Codachi webview content providers
 */
class CodachiContentProvider {
  protected _extensionUri: vscode.Uri
  protected _mediaPath: string
  protected _context: vscode.ExtensionContext

  constructor(context: vscode.ExtensionContext) {
    this._extensionUri = context.extensionUri
    this._mediaPath = path.join(context.extensionPath, 'media')
    this._context = context
  }

  /**
   * Process keystrokes to gain XP and handle level ups
   */
  onKeystroke() {
    const pet = PetState.getPet(this._context)
    pet.xp = pet.xp + 1

    // Check less frequently for higher level pets
    const isEgg = pet.level === 0
    const checkFrequency = isEgg ? 1 : 10

    if (pet.xp % checkFrequency !== 0) {
      return
    }

    const previousLevel = pet.level

    // Special handling for egg hatching
    if (isEgg && pet.xp >= 30) {
      console.log(`Egg is hatching at ${pet.xp} XP`)
      pet.level = 1
      pet.xp = 0
      pet.state = 'walking'

      // Set transition flag for hatching animation
      pet.isTransitionIn = true

      // Get default speed for level 1
      const petTypeData = petTypes.get(pet.type)
      if (petTypeData) {
        const level1Data = petTypeData.levels.get(1)
        if (level1Data && level1Data.animations[pet.state]) {
          pet.speed = level1Data.animations[pet.state].speed || 0
          pet.originalSpeed = pet.speed
        }
      }
    } else {
      // Normal level mutation for non-egg levels
      mutateLevel({ userPet: pet })
    }

    // Handle level changes
    if (pet.level !== previousLevel) {
      console.log(`Pet evolved from level ${previousLevel} to ${pet.level}`)

      // Only set transition flag for actual evolution, not view switching
      if (!PetState.isViewSwitching()) {
        pet.isTransitionIn = true
      }

      // Save the updated pet state
      PetState.savePet(this._context)

      // Update both views with new state
      this.updateViews(pet)

      // Show appropriate notification based on level change
      if (previousLevel === 0 && pet.level === 1) {
        vscode.window.showInformationMessage(`${pet.name} has hatched!`)
      } else {
        const shareButton = '🐦 Share this moment'
        vscode.window
          .showInformationMessage(
            `${pet.name} reached level ${pet.level}!`,
            shareButton
          )
          .then((selection) => {
            if (selection === shareButton) {
              vscode.env.openExternal(
                vscode.Uri.parse(
                  `https://codachi.monster/card?name=${pet.name}&level=${pet.level}&type=${pet.type}`
                )
              )
            }
          })
      }
    } else {
      // Save XP progress even if level didn't change
      PetState.savePet(this._context)
    }
  }

  /**
   * Update all active views with the current pet state
   */
  protected updateViews(pet: UserPet) {
    // Update panel view if it exists and is visible
    if (CodachiState.panel?.panel && getConfigurationPosition() === 'panel') {
      CodachiState.panel.panel.webview.postMessage({
        command: 'update-pet',
        data: { userPet: pet },
      })
    }

    // Update explorer view if it exists and is visible
    if (
      CodachiState.explorerView?._view &&
      getConfigurationPosition() === 'explorer'
    ) {
      CodachiState.explorerView._view.webview.postMessage({
        command: 'update-pet',
        data: { userPet: pet },
      })
    }
  }

  /**
   * Generate the HTML content for the webview
   */
  protected getWebviewContent(webview: vscode.Webview) {
    // Local path to main script run in the webview
    const scriptPathOnDisk = vscode.Uri.joinPath(
      this._extensionUri,
      'media',
      'main-bundle.js'
    )
    const stylesUriOnDisk = vscode.Uri.joinPath(
      this._extensionUri,
      'media',
      'main.css'
    )

    // Convert to webview URIs
    const scriptUri = webview.asWebviewUri(scriptPathOnDisk)
    const stylesUri = webview.asWebviewUri(stylesUriOnDisk)

    // Path to media resources on disk
    const basePetUri = webview.asWebviewUri(
      vscode.Uri.file(path.join(this._mediaPath))
    )

    const nonce = crypto.randomBytes(16).toString('base64')
    const pet = PetState.getPet(this._context)

    // Check if this is being displayed in the explorer view
    const isExplorerView =
      getConfigurationPosition() === 'explorer' &&
      this instanceof CodachiViewProvider

    // Add special styles for the explorer view to maximize space
    const extraStyles = isExplorerView
      ? `
      <style>
        body, html {
          padding: 0 !important;
          margin: 0 !important;
          overflow: hidden !important;
          width: 100% !important;
          height: 100% !important;
        }
        
        #container {
          width: 100% !important;
          height: 100% !important; 
          padding: 0 !important;
          margin: 0 !important;
          overflow: hidden !important;
          position: relative !important;
        }
        
        #movement-container {
          padding: 0 !important;
          margin: 0 !important;
          width: calc(100% + 100px) !important;
          position: absolute !important;
          bottom: 0 !important;
          left: -15px !important;
        }
        
        #pet-container {
          position: relative !important;
          bottom: 0 !important;
        }
        
        img {
          image-rendering: pixelated !important;
        }
      </style>
    `
      : ''

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <script nonce="${nonce}">var exports = {};</script>
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${
        webview.cspSource
      }; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="${stylesUri}" rel="stylesheet">
      <title>codachi</title>
      ${extraStyles}
    </head>
    <body>
      <div id="container">
        <div id="movement-container">
          <div id="transition-container">
            <img id="transition" nonce="${nonce}" />
          </div>
          <div id="pet-container" >
            <img id="pet" nonce="${nonce}" />
          </div>
        </div>
      </div>
      
      <script nonce="${nonce}" src="${scriptUri}"></script>
      <script nonce="${nonce}">
        // Set a flag to let the animation script know we're in explorer mode
        window.isExplorerView = ${isExplorerView};
        codachiApp.app({ basePetUri: '${basePetUri}', userPet: ${JSON.stringify(
      pet
    )} });
      </script>
    </body>
    </html>`
  }

  /**
   * Generate the HTML content showing that Codachi is in a different view mode
   */
  protected getUnavailableContent(
    webview: vscode.Webview,
    currentPosition: Position
  ) {
    const nonce = crypto.randomBytes(16).toString('base64')

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>codachi</title>
      <style>
        body {
          font-family: var(--vscode-font-family);
          color: var(--vscode-foreground);
          padding: 20px;
          text-align: center;
        }
        h2 {
          margin-bottom: 20px;
        }
        p {
          margin-bottom: 15px;
        }
        .link {
          color: var(--vscode-textLink-foreground);
          cursor: pointer;
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <h2>Codachi is currently in ${currentPosition} mode</h2>
      <p>Your Codachi pet is currently displayed in the ${currentPosition}.</p>
      <p>You can change this setting by clicking <span class="link" id="settings-link">here</span>.</p>
      
      <script nonce="${nonce}">
        document.getElementById('settings-link').addEventListener('click', () => {
          const vscode = acquireVsCodeApi();
          vscode.postMessage({ command: 'open-settings' });
        });
      </script>
    </body>
    </html>`
  }
}

/**
 * Manages the Codachi panel view
 */
class PetPanel extends CodachiContentProvider {
  panel: vscode.WebviewPanel | undefined

  constructor(context: vscode.ExtensionContext) {
    super(context)
  }

  /**
   * Update the pet's scale factor
   */
  updateScale(scale: number): Thenable<void> {
    if (!this.panel) {
      return Promise.resolve()
    }

    const pet = PetState.getPet(this._context)
    pet.scale = scale

    if (pet.originalSpeed) {
      pet.speed = adjustSpeedForScale(pet.originalSpeed, scale)
    }

    // Don't set transition flag for scale updates
    pet.isTransitionIn = false

    // Update both panel and explorer views if they exist and are visible
    this.updateViews(pet)

    return PetState.savePet(this._context)
  }

  /**
   * Create or restore the panel view
   */
  createPanel(panel?: vscode.WebviewPanel): vscode.WebviewPanel {
    const baseMediaUri = vscode.Uri.joinPath(
      this._context.extensionUri,
      'media'
    )
    const position = getConfigurationPosition()

    // Create a new panel or use an existing one
    this.panel =
      panel ??
      vscode.window.createWebviewPanel(
        'petPanel',
        PetState.getPet(this._context).name,
        vscode.ViewColumn.Two,
        {
          enableScripts: true,
          localResourceRoots: [baseMediaUri],
        }
      )

    // Update panel title with pet name
    this.panel.title = PetState.getPet(this._context).name

    // Handle panel close
    this.panel.onDidDispose(
      () => {
        this.panel = undefined
        CodachiState.panel = undefined
      },
      null,
      this._context.subscriptions
    )

    // Handle panel visibility changes
    this.panel.onDidChangeViewState(
      (e) => {
        if (this.panel?.visible && position === 'panel') {
          // Only update content when the panel becomes visible and is the active view
          this.updateContent()
        }
      },
      null,
      this._context.subscriptions
    )

    // Handle messages from the webview
    this.panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case 'open-settings':
            vscode.commands.executeCommand(
              'workbench.action.openSettings',
              'codachi.position'
            )
            break
        }
      },
      undefined,
      this._context.subscriptions
    )

    // Set initial content
    this.updateContent()

    return this.panel
  }

  /**
   * Update the panel's content based on the current position
   */
  updateContent() {
    if (!this.panel) {
      return
    }

    const position = getConfigurationPosition()

    if (position === 'explorer') {
      // If position is explorer, show message that pet is in explorer view
      this.panel.webview.html = this.getUnavailableContent(
        this.panel.webview,
        'explorer'
      )
    } else {
      // Show the pet in the panel
      this.panel.webview.html = this.getWebviewContent(this.panel.webview)

      // Only send pet state message if we're in panel mode
      const pet = PetState.getPet(this._context)

      // Don't trigger transition animation when switching views
      if (PetState.isViewSwitching()) {
        pet.isTransitionIn = false
      }

      this.panel.webview.postMessage({
        command: 'update-pet',
        data: { userPet: pet },
      })
    }
  }
}

/**
 * Manages the Codachi explorer view
 */
class CodachiViewProvider
  extends CodachiContentProvider
  implements vscode.WebviewViewProvider
{
  public static readonly viewType = 'codachiView'
  _view?: vscode.WebviewView

  constructor(context: vscode.ExtensionContext) {
    super(context)
  }

  /**
   * Resolve the webview view when it becomes visible
   */
  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    }

    // Set initial content
    this.updateContent()

    // Handle messages from the webview
    webviewView.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case 'open-settings':
          vscode.commands.executeCommand(
            'workbench.action.openSettings',
            'codachi.position'
          )
          break
      }
    })
  }

  /**
   * Update the explorer view's content based on the current position
   */
  updateContent() {
    if (!this._view) {
      return
    }

    const position = getConfigurationPosition()

    if (position === 'panel') {
      // If position is panel, show message that pet is in panel
      this._view.webview.html = this.getUnavailableContent(
        this._view.webview,
        'panel'
      )
    } else {
      // Show the pet in the explorer view
      this._view.webview.html = this.getWebviewContent(this._view.webview)

      // Only send pet state message if we're in explorer mode
      const pet = PetState.getPet(this._context)

      // Don't trigger transition animation when switching views
      if (PetState.isViewSwitching()) {
        pet.isTransitionIn = false
      }

      this._view.webview.postMessage({
        command: 'update-pet',
        data: { userPet: pet },
      })
    }
  }
}

/**
 * Global state to track view instances
 */
class CodachiState {
  static panel: PetPanel | undefined
  static explorerView: CodachiViewProvider | undefined
}

/**
 * Extension activation entry point
 */
export function activate(context: vscode.ExtensionContext) {
  // Ensure the pet is loaded from storage
  PetState.getPet(context)

  // Create panel provider
  const petPanel = new PetPanel(context)
  CodachiState.panel = petPanel

  // Create explorer view provider
  const codachiViewProvider = new CodachiViewProvider(context)
  CodachiState.explorerView = codachiViewProvider

  // Set context for when condition
  updateExtensionPositionContext()

  // Register explorer view provider
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      CodachiViewProvider.viewType,
      codachiViewProvider,
      {
        webviewOptions: {
          retainContextWhenHidden: true,
        },
      }
    )
  )

  // Register keystroke handler
  vscode.commands.registerCommand('type', async (args) => {
    if (getConfigurationPosition() === 'panel' && CodachiState.panel) {
      CodachiState.panel.onKeystroke()
    } else if (
      getConfigurationPosition() === 'explorer' &&
      CodachiState.explorerView
    ) {
      CodachiState.explorerView.onKeystroke()
    }
    return vscode.commands.executeCommand('default:type', args)
  })

  // Register show panel command
  context.subscriptions.push(
    vscode.commands.registerCommand('codachi.showPanel', () => {
      return new Promise<void>((resolve) => {
        const position = getConfigurationPosition()

        if (position !== 'panel') {
          vscode.window.showInformationMessage(
            'Codachi is currently set to display in the explorer view. You can change this in the settings.'
          )
          vscode.commands.executeCommand(
            'workbench.action.openSettings',
            'codachi.position'
          )
          resolve()
          return
        }

        if (CodachiState.panel && CodachiState.panel.panel) {
          // Panel is already open, no need to create it
          resolve()
          return
        }

        // Create the panel
        const panel = petPanel.createPanel()

        // Wait a brief moment for the panel to initialize
        setTimeout(() => {
          resolve()
        }, 100)
      })
    })
  )

  // Register spawn new pet command
  context.subscriptions.push(
    vscode.commands.registerCommand('codachi.spawnNewPet', () => {
      const position = getConfigurationPosition()

      // If we're in panel mode but panel isn't open, show it first
      if (position === 'panel' && !CodachiState.panel?.panel) {
        // First create the panel if needed
        vscode.commands.executeCommand('codachi.showPanel').then(() => {
          // Then create the pet after panel is open
          createNewPet()
        })
        return
      }

      // Otherwise just create a new pet directly
      createNewPet()

      // Helper function to create and spawn a new pet
      function createNewPet() {
        // Create a new pet with the transition flag set
        const pet = PetState.createNewPet(context)

        // Update the active view based on current position
        if (position === 'panel' && CodachiState.panel?.panel) {
          CodachiState.panel.panel.title = pet.name
          CodachiState.panel.panel.webview.postMessage({
            command: 'spawn-pet',
            data: { userPet: pet },
          })
        } else if (
          position === 'explorer' &&
          CodachiState.explorerView?._view
        ) {
          CodachiState.explorerView._view.webview.postMessage({
            command: 'spawn-pet',
            data: { userPet: pet },
          })
        }
      }
    })
  )

  // Register open explorer command
  context.subscriptions.push(
    vscode.commands.registerCommand('codachi.openExplorer', async () => {
      const position = getConfigurationPosition()

      if (position !== 'explorer') {
        // Set view switching flag to prevent transition animations
        PetState.setViewSwitching(true)

        // Change the setting to explorer mode
        await vscode.workspace
          .getConfiguration()
          .update(
            'codachi.position',
            'explorer',
            vscode.ConfigurationTarget.Global
          )

        // Clear the view switching flag
        PetState.setViewSwitching(false)

        // Show information message
        vscode.window
          .showInformationMessage(
            'Codachi mode changed to explorer. Look for Codachi in the Explorer view!',
            'Show Explorer'
          )
          .then((selection) => {
            if (selection === 'Show Explorer') {
              vscode.commands.executeCommand('workbench.view.explorer')
            }
          })
      } else {
        // Just focus the explorer view
        vscode.commands.executeCommand('workbench.view.explorer')
      }
    })
  )

  // Register panel serializer for restoring panel state
  if (vscode.window.registerWebviewPanelSerializer) {
    vscode.window.registerWebviewPanelSerializer('petPanel', {
      async deserializeWebviewPanel(panel: vscode.WebviewPanel, _: any) {
        CodachiState.panel = new PetPanel(context)
        CodachiState.panel.createPanel(panel)
      },
    })
  }

  // Listen for changes to configuration
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(
      (e: vscode.ConfigurationChangeEvent): void => {
        if (e.affectsConfiguration('codachi.scaleFactor')) {
          const scaleFactor = vscode.workspace
            .getConfiguration()
            .get('codachi.scaleFactor', 1.0)

          if (CodachiState.panel) {
            CodachiState.panel.updateScale(scaleFactor)
          }
        }

        if (e.affectsConfiguration('codachi.position')) {
          // Set view switching flag to prevent transition animations
          PetState.setViewSwitching(true)

          // Update VS Code context
          updateExtensionPositionContext()

          // Update both views based on the new position
          if (CodachiState.panel?.panel) {
            CodachiState.panel.updateContent()
          }

          if (CodachiState.explorerView) {
            CodachiState.explorerView.updateContent()
          }

          // Focus on the correct view
          const position = getConfigurationPosition()
          if (position === 'explorer') {
            vscode.commands.executeCommand('workbench.view.explorer')
          }

          // Clear the view switching flag
          PetState.setViewSwitching(false)
        }
      }
    )
  )

  // Update context when text editor changes
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(updateExtensionPositionContext)
  )
}

/**
 * Extension deactivation
 */
export function deactivate() {}
