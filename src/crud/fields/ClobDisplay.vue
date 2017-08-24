<template>
	<div>
		{{ valueTruncated }}
	</div>
</template>

<script>
    const maxCharsToDisplay = 50

	export default {
		props: [ 'value', 'field' ],
        computed: {
            valueTruncated() {
                return this.value.length <= maxCharsToDisplay ? this.value : this.value.substr(0, maxCharsToDisplay) + '...'
            },
        },
	}
</script>
