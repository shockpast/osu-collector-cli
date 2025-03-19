// queue.ts - creating queue and handling it much easier

export class Queue {
  private _occupied: boolean = false
  private _processed: number = 0

  public isOccupied(): boolean {
    return this._occupied
  }

  public occupy(): void {
    this._occupied = true
  }

  public release(): void {
    this._occupied = false
  }

  public incrementProcessed(): void {
    this._processed++
  }

  public getProcessedCount(): number {
    return this._processed
  }
}