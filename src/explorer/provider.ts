import * as crypto from 'crypto'
import * as path from 'path'
import * as vscode from 'vscode'
import {
  adjustSpeedForScale,
  generatePet,
  randomPetName,
  randomPetType,
  UserPet,
} from '../panel'

export class CodachiViewProvider implements vscode.WebviewViewProvider {
  // Update view type IDs to match the ones in package.json
  public static readonly explorerViewType = 'codachiExplorerView'
  public static readonly panelViewType = 'codachiPanelView'

  private _view?: vscode.WebviewView
  private _userPet?: UserPet
  private _extensionUri: vscode.Uri
  private _mediaPath: string
  private _isExplorerView: boolean

  constructor(
    context: vscode.ExtensionContext,
    userPet?: UserPet,
    isExplorerView: boolean = false
  ) {
    this._extensionUri = context.extensionUri
    this._mediaPath = path.join(context.extensionPath, 'media')
    this._userPet = userPet
    this._isExplorerView = isExplorerView
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this._extensionUri, 'media')],
    }

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview)

    // Handle messages from the webview
    webviewView.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case 'spawn-new-pet':
          this.spawnNewPet()
          break
      }
    })

    // Add visibility change handler
    webviewView.onDidChangeVisibility(() => {
      if (webviewView.visible && this._userPet) {
        // When the view becomes visible again, pass the pet object as-is
        // without modifying any state properties like isTransitionIn
        this._view?.webview.postMessage({
          command: 'update-pet',
          data: { userPet: this._userPet },
        })
      }
    })

    // Initialize pet if available
    if (this._userPet) {
      this.updatePet(this._userPet)
    }
  }

  public getUserPet(): UserPet | undefined {
    return this._userPet
  }

  public updatePet(userPet: UserPet) {
    // Check if the current pet is an egg (level 0, idle state with isTransitionIn)
    const isCurrentlyEgg =
      this._userPet?.level === 0 &&
      this._userPet?.state === 'idle' &&
      this._userPet?.isTransitionIn === true

    // Create a copy to avoid reference issues
    this._userPet = { ...userPet }

    // Only preserve egg state for actual level 0 pets that were already eggs
    // Never force a hatched pet back to egg state
    if (isCurrentlyEgg && this._userPet.level === 0) {
      this._userPet.state = 'idle'
      this._userPet.isTransitionIn = true
    }

    if (this._view) {
      this._view.webview.postMessage({
        command: 'update-pet',
        data: { userPet: this._userPet },
      })
    }
  }

  public updateScale(scale: number) {
    if (!this._userPet || !this._view) {
      return
    }

    this._userPet.scale = scale

    if (this._userPet.originalSpeed) {
      this._userPet.speed = adjustSpeedForScale(
        this._userPet.originalSpeed,
        scale
      )
    }

    this._view.webview.postMessage({
      command: 'update-pet',
      data: { userPet: this._userPet },
    })
  }

  // This method is no longer used directly - keystroke handling is now centralized in extension.ts
  public onKeystroke() {
    // Stub for backward compatibility
    if (!this._userPet) {
      return
    }
    return this._userPet
  }

  public spawnNewPet() {
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

    // New pets should always start as eggs
    pet.level = 0
    pet.xp = 0
    pet.state = 'idle'
    pet.isTransitionIn = true

    this._userPet = pet

    if (this._view) {
      this._view.webview.postMessage({
        command: 'spawn-pet',
        data: { userPet: pet },
      })
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
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

    // Safely serialize the pet object with defaults if undefined
    const petJson = this._userPet ? JSON.stringify(this._userPet) : '{}'

    // Add a special class to the container if this is an explorer view to reduce padding
    const containerClass = this._isExplorerView ? 'explorer-view' : ''

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <script nonce="${nonce}">var exports = {};</script>
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="${stylesUri}" rel="stylesheet">
      <title>codachi</title>
      <style nonce="${nonce}">
        .explorer-view #movement-container {
          /* Reduce padding for explorer view */
          padding-left: 10px !important;
          padding-right: 10px !important;
        }
        
        /* Reduce the height of the container in explorer view by 1/3 */
        .explorer-view #container {
          height: 66% !important;
          max-height: 150px !important;
        }
        
        /* Keep pets on the ground */
        .explorer-view #movement-container {
          position: absolute;
          bottom: 0;
        }
      </style>
    </head>
    <body>
      <div id="container" class="${containerClass}">
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
      <script nonce="${nonce}">codachiApp.app({ basePetUri: '${basePetUri}', userPet: ${petJson} });</script>
    </body>
    </html>`
  }
}
