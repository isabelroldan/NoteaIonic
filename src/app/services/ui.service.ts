import { Injectable, inject } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class UIService {
  private loadingC = inject(LoadingController);
  private toastC = inject(ToastController);
  private loadingElement!: HTMLIonLoadingElement | undefined;

  constructor() { }

  /**
 * Shows a loading spinner with an optional message.
 * 
 * @param msg The optional message to display in the loading spinner.
 * @returns A promise that resolves when the loading spinner is shown.
 */
  showLoading(msg?: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (this.loadingElement && this.loadingElement.isOpen) {
        resolve();
      } else {
        this.loadingElement = await this.loadingC.create({ message: msg });
        this.loadingElement.present();
        resolve();
      }
    })
  }

  /**
 * Hides the loading spinner.
 * 
 * @returns A promise that resolves when the loading spinner is hidden.
 */
  async hideLoading(): Promise<void> {
    if (!this.loadingElement) return;
    await this.loadingElement.dismiss();
    this.loadingElement = undefined;
  }

  /**
 * Shows a toast message.
 * 
 * @param msg The message to display in the toast.
 * @param color The color of the toast. Default is 'primary'.
 * @param duration The duration of the toast in milliseconds. Default is 3000ms.
 * @param position The position of the toast. Default is 'bottom'.
 * @returns A promise that resolves when the toast is shown.
 */
  async showToast(msg: string, color: string = 'primary', duration: number = 3000, position: "top" | "bottom" | "middle" = 'bottom'): Promise<void> {
    let toast: HTMLIonToastElement = await this.toastC.create({
      message: msg,
      duration: duration,
      position: position,
      color: color,
      translucent: true
    });
    toast.present();
  }
}