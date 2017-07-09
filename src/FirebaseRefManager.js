export default class FirebaseRefManager {
	constructor() {
		this.activeWatchers = []
	}
	add(ref, eventType, callback) {
		ref.on(eventType, callback)
		this.activeWatchers.push([ref, eventType, callback])
	}
	removeAll() {
		while (this.activeWatchers.length) {
			var [ ref, eventType, callback ] = this.activeWatchers.pop()
			ref.off(eventType, callback)
		}
	}
}
