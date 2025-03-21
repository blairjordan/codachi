// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import path = require('path')
import * as crypto from 'crypto'
import * as vscode from 'vscode'
import { CodachiViewProvider } from '../explorer/provider'
import {
  adjustSpeedForScale,
  generatePet,
  mutateLevel,
  randomPetName,
  randomPetType,
  UserPet,
} from '../panel'

// Define display mode type to avoid type comparison errors
type DisplayMode = 'panel' | 'explorer'

const randomPet = (): UserPet => {
  const scaleFactor = vscode.workspace
    .getConfiguration()
    .get('codachi.scaleFactor', 1.0)

  const pet = generatePet({
    type: randomPetType(),
    name: randomPetName(),
  })

  pet.scale = scaleFactor

  if (pet.speed) {
    pet.originalSpeed = pet.speed
  }

  return pet
}

const getPetFromStorage = (storage: vscode.Memento): UserPet => {
  const storedPets = storage.get('pets')
  let userPet = randomPet()
  if (!storedPets) {
    storage.update('pets', [userPet])
  } else {
    userPet = (storedPets as UserPet[])[0] // Only supporting a single pet for now ...

    // Ensure originalSpeed is set for stored pets
    if (!userPet.originalSpeed && userPet.speed) {
      userPet.originalSpeed = userPet.speed
    }
  }
  return userPet
}

class PetPanel {
  panel: vscode.WebviewPanel | undefined
  private _userPet: UserPet
  private _extensionUri: vscode.Uri
  private _mediaPath: string

  public static currentPanel: PetPanel | undefined

  getUserPet() {
    return this._userPet
  }

  setUserPet(userPet: UserPet) {
    this._userPet = userPet

    // Update panel title if panel exists
    if (this.panel) {
      this.panel.title = this._userPet.name
    }
  }

  constructor({
    userPet,
    context,
  }: {
    userPet: UserPet
    context: vscode.ExtensionContext
  }) {
    this._userPet = userPet
    this._extensionUri = context.extensionUri
    this._mediaPath = path.join(context.extensionPath, 'media')

    // Set the current panel as this one
    PetPanel.currentPanel = this
  }

  updateScale(context: vscode.ExtensionContext, scale: number) {
    if (!this.panel) {
      return
    }
    this._userPet.scale = scale

    if (this._userPet.originalSpeed) {
      this._userPet.speed = adjustSpeedForScale(
        this._userPet.originalSpeed,
        scale
      )
    }

    this.panel.webview.postMessage({
      command: 'update-pet',
      data: { userPet: this._userPet },
    })
  }

  // This method is no longer used directly - keystroke handling is now centralized in extension.ts
  onKeystroke(context: vscode.ExtensionContext) {
    // Stub for backward compatibility
    return this._userPet
  }

  createPanel({
    context,
    panel,
  }: {
    context: vscode.ExtensionContext
    panel?: vscode.WebviewPanel
  }) {
    const baseMediaUri = vscode.Uri.joinPath(context.extensionUri, 'media')

    // Create and show a new webview
    this.panel =
      panel ??
      vscode.window.createWebviewPanel(
        'petPanel', // Identifies the type of the webview. Used internally
        this.getUserPet() ? this.getUserPet().name : 'pet', // Title of the panel displayed to the user
        vscode.ViewColumn.Two, // Editor column to show the new webview panel in.
        {
          enableScripts: true,
          localResourceRoots: [baseMediaUri],
        }
      )

    this.panel.title = this._userPet.name

    this.panel.onDidDispose(
      () => {
        // Only clear the current panel reference if this is the current panel
        if (PetPanel.currentPanel === this) {
          PetPanel.currentPanel = undefined
        }
      },
      null,
      context.subscriptions
    )

    this.panel.onDidChangeViewState(
      (e) => {
        try {
          // Pass the exact pet object without any modifications
          // This is critical for preserving the correct state
          if (this.panel?.visible) {
            this.panel?.webview.postMessage({
              command: 'update-pet',
              data: { userPet: this._userPet },
            })
          }
        } catch (error) {
          // Ignore errors when posting messages to disposed webviews
        }
      },
      null,
      context.subscriptions
    )

    this.update()

    return this.panel
  }

  public update() {
    if (this.panel && this.panel.visible) {
      try {
        this._update()
      } catch (error) {
        // If update fails, the panel is likely disposed
        PetPanel.currentPanel = undefined
      }
    }
  }

  private _update() {
    if (!this.panel) {
      throw new Error('Webpanel not found')
    }
    this.panel.webview.html = this.getWebviewContent(this.panel.webview)
  }

  private getWebviewContent(webview: vscode.Webview) {
    if (!this.panel) {
      throw new Error('Panel undefined')
    }

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

    // And the uri we use to load this script in the webview
    const scriptUri = webview.asWebviewUri(scriptPathOnDisk)
    const stylesUri = webview.asWebviewUri(stylesUriOnDisk)

    // Path to media resources on disk
    const basePetUri = webview.asWebviewUri(
      vscode.Uri.file(path.join(this._mediaPath))
    )

    const nonce = crypto.randomBytes(16).toString('base64')

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <script  nonce="${nonce}">var exports = {};</script>
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${
        this.panel.webview.cspSource
      }; img-src ${
      this.panel.webview.cspSource
    } https:; script-src 'nonce-${nonce}';">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="${stylesUri}" rel="stylesheet">
      <title>codachi</title>
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
      <script nonce="${nonce}">codachiApp.app({ basePetUri: '${basePetUri}', userPet: ${JSON.stringify(
      this.getUserPet()
    )} });</script>
    </body>
    </html>`
  }
}

// Global shared pet state
let sharedUserPet: UserPet
let activePetProvider: 'panel' | 'explorer' | null = null

// Track if a keystroke listener is registered to prevent multiple registrations
let keystrokeListenerRegistered = false

export function activate(context: vscode.ExtensionContext) {
  sharedUserPet = getPetFromStorage(context.globalState)

  // Apply current scale factor to existing pet
  const scaleFactor = vscode.workspace
    .getConfiguration()
    .get('codachi.scaleFactor', 1.0)
  sharedUserPet.scale = scaleFactor

  // Get the display mode preference
  const displayMode = vscode.workspace
    .getConfiguration()
    .get('codachi.displayMode', 'panel') as DisplayMode

  activePetProvider = displayMode

  vscode.commands.executeCommand(
    'setContext',
    'codachi.displayMode',
    displayMode
  )

  const petPanel = new PetPanel({
    userPet: sharedUserPet,
    context,
  })

  // Create view providers
  const explorerViewProvider = new CodachiViewProvider(
    context,
    sharedUserPet,
    true
  )
  const panelViewProvider = new CodachiViewProvider(
    context,
    sharedUserPet,
    false
  )

  // Register both view providers
  const explorerViewRegistration = vscode.window.registerWebviewViewProvider(
    CodachiViewProvider.explorerViewType,
    explorerViewProvider
  )

  const panelViewRegistration = vscode.window.registerWebviewViewProvider(
    CodachiViewProvider.panelViewType,
    panelViewProvider
  )

  context.subscriptions.push(explorerViewRegistration)
  context.subscriptions.push(panelViewRegistration)

  // Helper function to synchronize pet state between views
  function synchronizePetState(userPet: UserPet) {
    // Check if current shared pet is an egg
    const isCurrentlyEgg =
      sharedUserPet?.level === 0 &&
      sharedUserPet?.state === 'idle' &&
      sharedUserPet?.isTransitionIn === true

    // Update shared state with the new pet state
    sharedUserPet = { ...userPet }

    // Only preserve egg state for actual level 0 pets that were already eggs
    // Never force a hatched pet back to egg state
    if (isCurrentlyEgg && sharedUserPet.level === 0) {
      sharedUserPet.state = 'idle'
      sharedUserPet.isTransitionIn = true
    }

    // Always update the Explorer view to ensure state consistency
    explorerViewProvider.updatePet(sharedUserPet)

    // Update the panel if it's the active provider
    if (activePetProvider === 'panel' && petPanel && petPanel.panel) {
      try {
        petPanel.setUserPet(sharedUserPet)
        petPanel.update()
      } catch (e) {
        // If we can't update the panel, it might be disposed
        // In this case, we don't need to do anything special
      }
    }
  }

  // Respawn pet command
  context.subscriptions.push(
    vscode.commands.registerCommand('codachi.respawnPet', () => {
      sharedUserPet = randomPet()
      context.globalState.update('lastLevel', 0)

      if (activePetProvider === 'explorer') {
        explorerViewProvider.updatePet(sharedUserPet)
      } else if (activePetProvider === 'panel' && petPanel) {
        try {
          petPanel.setUserPet(sharedUserPet)
          petPanel.update()
        } catch (e) {
          vscode.window.showErrorMessage(
            'Failed to update pet. Try reopening the panel.'
          )
        }
      }

      synchronizePetState(sharedUserPet)
    })
  )

  // Register keystroke listener once
  if (!keystrokeListenerRegistered) {
    const typeCommand = vscode.commands.registerCommand(
      'type',
      async (args) => {
        if (typeof sharedUserPet.xp !== 'number') {
          sharedUserPet.xp = 0
        }

        sharedUserPet.xp += 1

        // Check for level up every 10 keystrokes
        if (sharedUserPet.xp % 10 === 0) {
          const previousLevel = sharedUserPet.level
          mutateLevel({ userPet: sharedUserPet })

          if (sharedUserPet.level !== previousLevel) {
            sharedUserPet.isTransitionIn = true

            if (activePetProvider === 'panel' && petPanel) {
              petPanel.setUserPet(sharedUserPet)
              if (petPanel.panel) {
                petPanel.panel.webview.postMessage({
                  command: 'update-pet',
                  data: { userPet: sharedUserPet },
                })
              }
            } else if (activePetProvider === 'explorer') {
              explorerViewProvider.updatePet(sharedUserPet)
            }

            synchronizePetState(sharedUserPet)
          }
        }

        return vscode.commands.executeCommand('default:type', args)
      }
    )

    context.subscriptions.push(typeCommand)
    keystrokeListenerRegistered = true
  }

  // Show panel command
  context.subscriptions.push(
    vscode.commands.registerCommand('codachi.showPanel', () => {
      // Clean up any existing panel
      if (petPanel) {
        try {
          if (petPanel.panel) {
            petPanel.panel.dispose()
          }
        } catch (e) {
          // Ignore disposal errors
        }
        PetPanel.currentPanel = undefined
      }

      // Create new panel with the current shared pet state
      const newPetPanel = new PetPanel({
        userPet: sharedUserPet,
        context,
      })

      activePetProvider = 'panel'

      const panel = newPetPanel.createPanel({ context })

      try {
        // Use the current shared pet state - very important for state preservation
        // This ensures the panel shows the pet in its current state (egg or hatched)
        panel.webview.postMessage({
          command: 'update-pet',
          data: { userPet: sharedUserPet },
        })
      } catch (e) {
        vscode.window.showErrorMessage(
          'Failed to show Codachi panel. Please try again.'
        )
      }
    })
  )

  // Show explorer command
  context.subscriptions.push(
    vscode.commands.registerCommand('codachi.showExplorer', () => {
      activePetProvider = 'explorer'
      vscode.commands.executeCommand('codachiExplorerView.focus')
    })
  )

  // Spawn new pet command
  context.subscriptions.push(
    vscode.commands.registerCommand('codachi.spawnNewPet', () => {
      sharedUserPet = randomPet()

      // Ensure pet starts as an egg
      sharedUserPet.level = 0
      sharedUserPet.xp = 0
      sharedUserPet.state = 'idle'
      sharedUserPet.isTransitionIn = true

      context.globalState.update('lastLevel', 0)

      // Update both panel and explorer views
      explorerViewProvider.updatePet(sharedUserPet)

      if (activePetProvider === 'panel') {
        if (petPanel && petPanel.panel) {
          try {
            petPanel.panel.webview.postMessage({
              command: 'spawn-pet',
              data: { userPet: sharedUserPet },
            })
            petPanel.panel.title = sharedUserPet.name
            petPanel.setUserPet(sharedUserPet)
          } catch (e) {
            // If there's an error, open a new panel
            vscode.commands.executeCommand('codachi.showPanel')
          }
        } else {
          // If panel is not available, open a new one
          vscode.commands.executeCommand('codachi.showPanel')
        }
      }

      // Make sure all views are synchronized
      synchronizePetState(sharedUserPet)
    })
  )

  if (vscode.window.registerWebviewPanelSerializer) {
    vscode.window.registerWebviewPanelSerializer('petPanel', {
      async deserializeWebviewPanel(panel: vscode.WebviewPanel, _: any) {
        const newPetPanel = new PetPanel({
          userPet: sharedUserPet,
          context,
        })

        newPetPanel.createPanel({ context, panel })
      },
    })
  }

  vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration('codachi.scaleFactor')) {
      const scaleFactor = vscode.workspace
        .getConfiguration()
        .get('codachi.scaleFactor', 1.0)

      if (activePetProvider === 'panel' && PetPanel.currentPanel) {
        try {
          PetPanel.currentPanel.updateScale(context, scaleFactor)
          synchronizePetState(sharedUserPet)
        } catch (e) {
          vscode.window.showErrorMessage('Failed to update pet scale.')
        }
      } else if (activePetProvider === 'explorer') {
        explorerViewProvider.updateScale(scaleFactor)
        synchronizePetState(sharedUserPet)
      }
    }

    if (event.affectsConfiguration('codachi.explorerHeight')) {
      // When explorer height changes, we need to recreate the view
      if (activePetProvider === 'explorer') {
        // Focus will reload the view with the new height
        vscode.commands.executeCommand('codachiExplorerView.focus')
      }
    }

    if (event.affectsConfiguration('codachi.displayMode')) {
      const newDisplayMode = vscode.workspace
        .getConfiguration()
        .get('codachi.displayMode', 'panel') as DisplayMode

      activePetProvider = newDisplayMode

      vscode.commands.executeCommand(
        'setContext',
        'codachi.displayMode',
        newDisplayMode
      )

      // Never try to manipulate the egg state when switching display modes
      // Let the individual providers handle the pet state correctly

      if (newDisplayMode === 'explorer') {
        vscode.commands.executeCommand('codachiExplorerView.focus')
        if (PetPanel.currentPanel && PetPanel.currentPanel.panel) {
          try {
            PetPanel.currentPanel.panel.dispose()
            PetPanel.currentPanel = undefined
          } catch (e) {
            PetPanel.currentPanel = undefined
          }
        }
      } else if (newDisplayMode === 'panel') {
        if (PetPanel.currentPanel) {
          try {
            if (PetPanel.currentPanel.panel) {
              PetPanel.currentPanel.panel.dispose()
            }
          } catch (e) {
            // Ignore disposal errors
          }
          PetPanel.currentPanel = undefined
        }

        vscode.commands.executeCommand('codachi.showPanel')
      }
    }
  })

  // Focus explorer view on startup if needed
  if (displayMode === 'explorer') {
    vscode.commands.executeCommand('codachiExplorerView.focus')
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
