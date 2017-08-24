<template>
	<div>
		{{ value.text }}
	</div>
</template>

<script>
	export default {
		props: [ 'value', 'field' ],
	}
</script>
