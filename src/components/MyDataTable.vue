<template>
	<div class="myDataTableWrap">
		<table class="myDataTable">
			<slot></slot>
		</table>
	</div>
</template>

<script>
	export default {
	}
</script>

<style scoped>
	.myDataTableWrap {
		overflow-x: auto;
		width: 100%;
	}
	.myDataTable {
		border-collapse: collapse;
		width: 100%;
	}
	.myDataTable th {
		text-align: left;
	}
	.myDataTable th {
		padding: 15px 15px 5px;
	}
	.myDataTable td {
		padding: 0px 15px;
		border-top: 1px solid #ddd;
	}
	.myDataTable tbody tr {
		height: 48px;
	}
	.myDataTable thead tr {
		height: 48px;
	}
	.myDataTable tbody tr:nth-child(odd) {
		background-color: #f8f8f8;
	}
	.center { text-align: center !important; }
</style>
