<template>
	<div>

		<v-card>
			<v-card-title class="primary white--text">
				Configure Pages
			</v-card-title>
			<v-card-text>
				
				<CrudList
					:fields="{ name: { order: 0, name: 'Name' }, type: { order: 1, name: 'Path' } }"
					:records="$store.get.site.pages"
					@modify="$router.push(`edit/${$event}`)"
					@delete="alert('todo')"
				>
					<span slot="noResults">No pages</span>
				</CrudList>

			</v-card-text>
			<v-card-text class="text-xs-right">

				<v-btn primary @click.native.stop="$router.push(`edit`)">Create Page</v-btn>

			</v-card-text>
		</v-card>

	</div>
</template>

<script>

	export default {
	}

</script>

