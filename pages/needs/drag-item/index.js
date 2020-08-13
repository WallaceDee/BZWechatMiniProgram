Component({
	properties: {
		columns: {
			type: Number,
			value: 1
		},
		itemData: {
			type: Object,
			value: {}
		}
	},
	methods: {
		deleteItem(e) {
			this.triggerEvent('click')
		}
	},
	ready() {
	}
})
