<template>
	<div>

		<v-card>
			<v-card-title class="deep-orange white--text">
				Route not found
			</v-card-title>
			<v-card-text>
				<strong>
				{{ $route.fullPath }}
				</strong>
				<br>
				does not map to any routes
			</v-card-text>
		</v-card>

	</div>
</template>

<script>

	export default {
		props: [],
		data() {
			return {
			}
		},
	}

</script>

