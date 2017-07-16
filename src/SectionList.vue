<template>
	<div>

		<v-card>
			<v-card-title class="primary white--text">
				Configure Sections
			</v-card-title>
			<v-card-text>
				
				<CrudList
					:fields="{ name: { order: 0, name: 'Name' }, type: { order: 1, name: 'Type' } }"
					:records="$store.get.site.sections"
					@modify="$router.push(`edit/${$event}`)"
					@delete="alert('todo')"
				>
					<span slot="noResults">No sections</span>
				</CrudList>

			</v-card-text>
			<v-card-text class="text-xs-right">

				<v-btn primary @click.native.stop="$router.push(`edit`)">Create Section</v-btn>

			</v-card-text>
		</v-card>

	</div>
</template>

<script>

	export default {
	}

</script>

