// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import path = require('path')
import * as vscode from 'vscode'
import * as crypto from 'crypto'
import {
  generatePet,
  mutateLevel,
  randomPetType,
  randomPetName,
  UserPet,
} from '../panel'

const randomPet = (): UserPet =>
  generatePet({
    type: randomPetType(),
    name: randomPetName(),
  })

const getPetFromStorage = (storage: vscode.Memento): UserPet => {
  const storedPets = storage.get('pets')
  let userPet = randomPet()
  if (!storedPets) {
    storage.update('pets', [userPet])
  } else {
    userPet = (storedPets as UserPet[])[0] // Only supporting a single pet for now ...
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
  }

  constructor({
    userPet,
    extensionPath,
    extensionUri,
  }: {
    userPet: UserPet
    extensionPath: string
    extensionUri: vscode.Uri
  }) {
    this._userPet = userPet
    this._extensionUri = extensionUri
    this._mediaPath = path.join(extensionPath, 'media')
  }

  onKeystroke(context: vscode.ExtensionContext) {
    this._userPet.xp = this._userPet.xp + 1

    // Check level change every 10 keystrokes
    if (!(this.panel && this._userPet.xp % 10 === 0)) {
      return
    }

    const previousLevel = this._userPet.level
    mutateLevel({ userPet: this._userPet })

    if (this._userPet.level !== previousLevel) {
      this.panel.webview.postMessage({
        command: 'update-pet',
        data: { userPet: this._userPet },
      })
      this._userPet.isTransitionIn = false
      context.globalState.update('pets', [this._userPet])

      const shareButton = '🐦 Share this moment'
      vscode.window
        .showInformationMessage(
          `${this._userPet.name} reached level ${this._userPet.level}!`,
          shareButton
        )
        .then((selection) => {
          if (selection === shareButton) {
            vscode.env.openExternal(
              vscode.Uri.parse(
                `https://codachi.monster/card?name=${this._userPet.name}&level=${this._userPet.level}&type=${this._userPet.type}`
              )
            )
          }
        })
    }
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
        this.panel!.dispose()
        PetPanel.currentPanel = undefined
      },
      null,
      context.subscriptions
    )

    this.panel.onDidChangeViewState(
      (e) => {
        this.panel?.webview.postMessage({
          command: 'update-pet',
          data: { userPet: { ...this._userPet, isTransitionIn: false } },
        })
      },
      null,
      context.subscriptions
    )

    this.update()

    return this.panel
  }

  public update() {
    if (this.panel && this.panel.visible) {
      this._update()
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

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const userPet = getPetFromStorage(context.globalState)

  const petPanel = new PetPanel({
    userPet,
    extensionUri: context.extensionUri,
    extensionPath: context.extensionPath,
  }) // Default pet is random

  vscode.commands.registerCommand('type', async (args) => {
    petPanel.onKeystroke(context)
    return vscode.commands.executeCommand('default:type', args)
  })

  context.subscriptions.push(
    vscode.commands.registerCommand('codachi.showPanel', () => {
      if (PetPanel.currentPanel) {
        vscode.window.showErrorMessage('Codachi panel already open!')
        return
      }
      const userPet = getPetFromStorage(context.globalState)
      petPanel.setUserPet(userPet)
      const panel = petPanel.createPanel({ context })
      panel.webview.postMessage({
        command: 'spawn-pet',
        data: { userPet: { ...userPet, isTransitionIn: false } },
      })
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('codachi.putToSleep', () => {
      if (!petPanel.panel) {
        // TODO: raise actual error message
        vscode.window.showErrorMessage(
          'You need to open Codachi before putting your pet to sleep!'
        )
        return
      }

      if (userPet.state === 'sleeping') {
        vscode.window.showErrorMessage(`${userPet.name} is already asleep!`)
        return
      }

      petPanel.panel.webview.postMessage({
        command: 'put-to-sleep',
        data: { userPet: { ...userPet, state: 'sleeping' } },
      })
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('codachi.wakeUp', () => {
      if (!petPanel.panel) {
        // TODO: raise actual error message
        vscode.window.showErrorMessage(
          'You need to open Codachi before waking your pet up!'
        )
        return
      }

      petPanel.panel.webview.postMessage({
        command: 'wake-up',
        data: { userPet: { ...userPet, state: 'walking' } },
      })
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('codachi.spawnNewPet', () => {
      const userPet = randomPet()

      if (!petPanel.panel) {
        // TODO: raise actual error message
        vscode.window.showErrorMessage(
          'You need to open Codachi before creating a pet!'
        )
        return
      }

      context.globalState.update('pets', [userPet]).then(
        (_) => {
          if (!petPanel.panel) {
            throw new Error('Unable to update pet. Panel undefined.')
          }
          petPanel.panel.webview.postMessage({
            command: 'spawn-pet',
            data: { userPet },
          })
          petPanel.panel.title = userPet.name
          petPanel.setUserPet(userPet)
        },
        (err) => {
          throw new Error(err)
        }
      )
    })
  )

  if (vscode.window.registerWebviewPanelSerializer) {
    vscode.window.registerWebviewPanelSerializer('petPanel', {
      async deserializeWebviewPanel(panel: vscode.WebviewPanel, _: any) {
        PetPanel.currentPanel = new PetPanel({
          userPet,
          extensionUri: context.extensionUri,
          extensionPath: context.extensionPath,
        })
        petPanel.createPanel({ context, panel })
      },
    })
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
