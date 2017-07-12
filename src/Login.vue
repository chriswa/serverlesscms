<template>
	<div>
		<div>
			
			<v-alert :value="errorMessage" error class="mb-5" dismissible @click.native="errorMessage = undefined">
				{{ errorMessage }}
			</v-alert>

			<div v-if="!isRegisterForm">

				<form novalidate @submit.stop.prevent="login">
					
					<v-text-field label="Email" v-model="email"></v-text-field>
					<v-text-field label="Password" v-model="password" type="password"></v-text-field>
					
					<v-btn dark default type="submit" :disabled="!loginFormIsValid">Login</v-btn>
					<v-btn dark default @click.native="isRegisterForm = true">Register for a new account</v-btn>

				</form>

			</div>
			<div v-else>

				<v-alert :value="true" info class="mb-5">
					Tip: You can use a fake email address (but don't forget your password!)
				</v-alert>

				<form novalidate @submit.stop.prevent="register">
					
					<v-text-field label="Email" v-model="email"></v-text-field>
					<v-text-field label="Password" v-model="password" type="password"></v-text-field>
					<v-text-field label="Password (again)" v-model="passwordAgain" type="password"></v-text-field>

					<v-btn dark default type="submit" :disabled="!registerFormIsValid">Register</v-btn>
					<v-btn dark default @click.native="isRegisterForm = false">Login to an existing account</v-btn>

				</form>

			</div>
		</div>

	</div>
</template>

<script>
	import firebase from './firebase-integration'

	export default {
		data() {
			return {
				email:         	'',
				password:      	'',
				passwordAgain: 	'',
				errorMessage:  	undefined,
				isRegisterForm:	false,
			}
		},
		mounted() {
			if (this.$route.path.match(/^\/test/)) {
				this.email    = 'test@example.com'
				this.password = 'password'
				this.login()
				this.$router.push(this.$route.path.replace(/^\/test/, '') || '/')
			}
		},
		computed: {
			loginFormIsValid() {
				return this.email !== '' && this.password !== ''
			},
			registerFormIsValid() {
				return this.email !== '' && this.password !== '' && this.passwordAgain === this.password
			},
		},
		methods: {
			clearForms() {
				this.password     	= ''
				this.passwordAgain	= ''
			},
			submit() {
				this.isRegisterForm ? this.register() : this.login()
			},
			login() {
				this.errorMessage = undefined
				this.$store.dispatch('account/signIn', { email: this.email, password: this.password }).catch(error => {
					this.errorMessage = error.message
					this.clearForms()
				})
			},
			register() {
				this.errorMessage = undefined
				this.$store.dispatch('account/register', { email: this.email, password: this.password }).catch(error => {
					this.errorMessage = error.message
					this.clearForms()
				})
			},
		},
	}
</script>
