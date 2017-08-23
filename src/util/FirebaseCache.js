export default class FirebaseCache {
	constructor(firebaseBaseRef, ticksToLive = 5) {
		this.firebaseBaseRef     	= firebaseBaseRef
		this.activeUpdateCallback	= () => {}
		this.subscriptions       	= {}
		this.ticksToLive         	= ticksToLive
	}
	get(path, order, limit) {
		//return new Promise((outerResolve, outerReject) => {

			// create a unique representation for this query
			var subKey = this.composeSubKey(path, order, limit)

			// check if we already have this snapshot cached
			var sub = this.subscriptions[subKey]
			if (sub) {
				console.log(`FirebaseCache: reusing query: ${path}`)
				sub.age = 0 // reset the subscription's tick counter (so we know it's active)
			}

			else {
				console.log(`FirebaseCache: adding new query: ${path}`)

				// if we don't already have a subscription for this data, get it from firebase and cache the subscription
				var firebaseQuery = this.composeFirebaseQuery(path, order, limit)

				// create subscription object and cache it
				sub = this.subscriptions[subKey] = {
					age:             	0,
					snapshotPromise: 	undefined,
					firebaseQuery:   	firebaseQuery,
					firebaseCallback:	undefined,
					hasResponded:    	false,
					dataSnapshot:    	undefined,
				}

				// request the data from firebase, capturing its dataSnapshot (n.b. not dataSnapshot.val()) in a promise we can "then" repeatedly
				var firebaseCallback = undefined // we need to store this callback for later, so that we can "off" it
				sub.snapshotPromise = new Promise((resolve, reject) => {
					firebaseCallback = dataSnapshot => {
						sub.dataSnapshot = dataSnapshot

						resolve()

						// if this isn't the first time firebase has called our callback, and the subscription is still fresh (age 0,) fire the activeUpdateCallback so the caller can refresh
						console.log(`firebaseCallback ${path}: hasResponded = ${sub.hasResponded ? 'true' : 'false'} age = ${sub.age}`)
						console.log(dataSnapshot.val())
						if (!sub.hasResponded) {
							sub.hasResponded = true
						}
						else if (sub.age === 0) {
							this.activeUpdateCallback()
						}
					}
					firebaseQuery.on('value', firebaseCallback)
				})

				sub.firebaseCallback = firebaseCallback

			}

			// when the sub's snapshotPromise has resolved (n.b. important for cached subs too,) resolve with the dataSnapshot's value
			//sub.snapshotPromise.then(dataSnapshot => {
			//	outerResolve(dataSnapshot.val())
			//})
			return sub.snapshotPromise.then(() => { return sub.dataSnapshot.val() })

		//})
	}
	composeSubKey(path, order, limit) {
		return JSON.stringify([path, order, limit])
	}
	composeFirebaseQuery(path, order, limit) {
		var query = this.firebaseBaseRef.child(path)
		if (order) {
			if (order[0] === 'child'	) { query = query.orderByChild(order[1])	}
			if (order[0] === 'key'  	) { query = query.orderByKey()          	}
			if (order[0] === 'value'	) { query = query.orderByValue()        	}
		}
		if (limit) {
			_.each(limit, limitPart => {
				if (limitPart[0] === 'first'  	) { query = query.limitToFirst(limitPart[1])         	}
				if (limitPart[0] === 'last'   	) { query = query.limitToLast(limitPart[1])          	}
				if (limitPart[0] === 'startAt'	) { query = query.startAt(limitPart[1], limitPart[2])	}
				if (limitPart[0] === 'endAt'  	) { query = query.endAt(limitPart[1], limitPart[2])  	}
				if (limitPart[0] === 'equalTo'	) { query = query.equalTo(limitPart[1], limitPart[2])	}
			})
		}
		return query
	}
	tick() {
		var oldSubKeys = []
		_.each(this.subscriptions, (sub, subKey) => {
			sub.age += 1
			if (sub.age > this.ticksToLive) {
				oldSubKeys.push(subKey)
			}
		})
		//console.log(`FirebaseCache: removing ${oldSubKeys.length} queries`)
		_.each(oldSubKeys, subKey => {
			var sub = this.subscriptions[subKey]
			delete(this.subscriptions[subKey])
			sub.firebaseQuery.off('value', sub.firebaseCallback)
		})
	}
	destroy() {
		_.each(this.subscriptions, sub => {
			sub.firebaseQuery.off('value', sub.firebaseCallback)
		})
	}
}

/*

Filtering
- limitToFirst(n)    	Sets the maximum number of items to return from the beginning of the ordered list of results.
- limitToLast(n)     	Sets the maximum number of items to return from the end of the ordered list of results.
- startAt(value, key)	Return items greater than or equal to the specified key or value, depending on the order-by method chosen.
- endAt(value, key)  	Return items less than or equal to the specified key or value, depending on the order-by method chosen.
- equalTo(value, key)	Return items equal to the specified key or value, depending on the order-by method chosen.

Sorting
- orderByChild(path)	Order results by the value of a specified child key.
- orderByKey()      	Order results by child keys.
- orderByValue()    	Order results by child values.

*/
