<template>
	<div>

		<v-card>
			<v-card-title class="primary white--text">
				{{ section.name }}
			</v-card-title>
			<v-card-text v-if="loaded">

				<CrudList
					:fields="fields"
					:records="records"
					@modify="modify"
					@delete="alert('todo')"
				>
					<span slot="noResults">No records</span>
				</CrudList>

			</v-card-text>
			<v-card-text class="text-xs-right" v-if="loaded">

				<v-btn primary @click.native.stop="$router.push(`edit`)">Create Record</v-btn>

			</v-card-text>
		</v-card>

	</div>
</template>

<script>

	import FirebaseRefManager from './FirebaseRefManager'

	export default {
		props: [ "sectionId" ],
		data() {
			return {
				loaded: 	false,
				records:	undefined,
			}
		},
		computed: {
			site()   	{ return this.$store.get.site              	},
			section()	{ return this.site.sections[this.sectionId]	},
			fields() 	{ return this.section.fields               	},
		},
		mounted() {
			this.firebaseRefManager = new FirebaseRefManager()
			this.init()
		},
		beforeDestroy() {
			this.firebaseRefManager.removeAll()
		},
		watch: {
			$route(to, from) {
				this.firebaseRefManager.removeAll()
				this.init()
			},
		},
		methods: {
			init() {
				this.loaded = false
				this.firebaseRefManager.add(fireDB.ref(`/sites/${this.site.siteId}/records/${this.sectionId}`).limitToFirst(100), 'value', snapshot => {
					this.records = snapshot.val()
					this.loaded = true
				})
			},
			modify(recordId) {
				this.$router.push(`edit/${recordId}`)
			},
		},
	}

</script>

