<template>
	<div>

		<v-card>
			<v-card-title class="primary white--text">
				Configure Templates
			</v-card-title>
			<v-card-text>
				
				<CrudList
					:fields="{ name: { order: 0, name: 'Name' } }"
					:records="$store.get.site.templates"
					@modify="$router.push(`edit/${$event}`)"
					@delete="alert('todo')"
				>
					<span slot="noResults">No templates</span>
				</CrudList>

			</v-card-text>
			<v-card-text class="text-xs-right">

				<v-btn primary @click.native.stop="$router.push(`edit`)">Create Template</v-btn>

			</v-card-text>
		</v-card>

	</div>
</template>

<script>

	export default {
	}

</script>

