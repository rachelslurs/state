( function ( $, undefined ) {

window.TestObject = function TestObject ( initialState ) {
	
	/*
	 * A method of the `TestObject` object, defined as usual. This implementation is identified as
	 * being **autochthonous**, or "of the original owner", and as such will always be called in the
	 * context of the `TestObject` object, even after it has been relocated to the default state.
	 */
	this.methodOne = function () { return this instanceof TestObject /* always true */ && 'methodOne'; };
	
	// State definitions
	State( this,
		{
			/*
			 * A method defined on the default state. This implementation will be situated alongside
			 * `methodOne` inside the default state, however, because it is *not* autochthonous, like all
			 * state-declared methods, its calls will always be in the context of the state in which it was
			 * declared (in this case the default state).
			 */
			methodTwo: function () { return this instanceof State /* always true */ && 'methodTwo'; },
			
			
			// Three progressively more complex ways to define a state:
			
			// State 1. Simple: methods only
			Waiting: {
				methodOne: function () {
					return 'Waiting.methodOne';
				}
			},

			// State 2. Abbreviated: elements can be listed flatly; proper categorization is inferred
			Active: {
				// interpreted as a **method** (since "methodTwo" is neither an event or rule type).
				methodTwo: function () {
					return 'Active.methodTwo';
				},
				
				// interpreted as an **event** (since "arrive" is an event type) with one listener declared
				arrive: function ( event ) {
					// event.log();
				},

				// interpreted as an **event** (since "depart" is an event type) with multiple listeners declared
				depart: [
					function ( event ) {
						// event.log('1');
					},
					function ( event ) {
						// event.log('2');
					}
				],
				
				// interpreted as a **rule** (since "admit" is a rule type) constant
				admit: true,
				
				/*
				 * interpreted as a **rule** (since "release" is a rule type) function that may examine the
				 * counterpart `state` and then returns its ruling
				 */
				release: function ( state ) { return this.defaultState().isSuperstateOf( state ); /* always true */ },
				
				// a **substate**, with its own nested definition
				Champing: {
					// some stateful **data**
					data: {
						description: "I'm really ready"
					}
				},
				
				// a **transition**
				wiggle: State.Transition({})
			},

			// State 3. Verbose: elements are explicitly categorized
			Finished: {
				data: {
					a: 1,
					b: 'deux',
					c: false,
					d: {
						a: 'deep',
						b: 'thoughts'
					}
				},
				methods: {
					methodOne: function () {
						return 'Finished.methodOne';
					},
					methodThree: function ( uno, dos ) {
						return 'Finished.methodThree uno='+uno+' dos='+dos;
					}
				},
				events: {
					arrive: function ( event ) {
						// event.log();
					},
					depart: [
						function ( event ) {},
						function ( event ) {}
					]
				},
				rules: {
					release: {
						Waiting: function () { return false; },
						Active: function () { return false; },

						// leading "." references current state ('Finished.')
						'.CleaningUp': true
					},
					admit: {
						'Waiting, Active': function ( state ) {
							// console && console.log( 'Finished.allowArrivalFrom ' + state );
							return true;
						}
					}
				},
				states: {
					CleaningUp: {
						methodTwo: function () {
							return 'Finished.CleaningUp.methodTwo';
						},
						terminate: function () { return this.select( '..Terminated' ); },
						
						arrive: function ( event ) {
							// event.log( "I'm an event" );
						},
						
						weee: State.Transition({
							operation: function () { this.end(); }
						})
					},
					Terminated: {
						data: {
							a: 2,
							b: 'trois',
							d: {
								b: 'impact'
							}
						},
						methods: {
							methodTwo: function () {
								return 'Finished.Terminated.methodTwo';
							},
							methodThree: function ( uno, dos ) {
								var result = 'Finished.Terminated.methodThree';
								result += ' : ' + this.superstate().method('methodThree')( uno, dos );
								return result;
							}
						},
						rules: {
							release: {
								// empty string references the controller's default state
								'': function ( state ) {
									// "this" references current state ('Finished.Terminated')
									// "state" references state to which controller is being changed ('')
									// console && console.log( 'Denying departure from ' + this + ' to ' + state );
									return false;
								},
								'*': true
							},
							admit: {
								'..CleaningUp': function () { return true; },
								'...Waiting': function () { return true; },

								// "." references current state ('Finished.Terminated')

								// ".." references parent state ('Finished')
								'..': true,

								// "..." references root default state ('' == controller().defaultState())

								// ".*" references any child state of parent state
								'.*': function () { return false; },

								// ".**" references any descendant state of parent state
								'.**': function () { return true; }
							}
						},
						states: {
							ReallyDead: {
							}
							// et cetera
						}
					}
				},
				transitions: {
					'transitionName': {
						origin: '*',
						operation: function () {
							// do some business
							console && console.log( Date.now() + " - HANG ON, I'M OPERATING" );
							// debugger;
							var self = this;
							// setTimeout( function () {
							// 	self.end();
							// 	console && console.log( Date.now() + " - I'M DONE NOW GET ON WITH IT" );
							// 	// start();
							// }, 1000 );
							this.end();
						},
						/* TODO: promise-based serial and asynchronous queueing
						operations: [
							// double array literal indicates a set of parallel asynchronous operations
							[[
								function () {},
								function () {},
								function () {}
							]],
							// plain array literal indicates a sequential queue
							[
								function () {},
								function () {}
							]
						],
						*/
						start: function ( event ) {
							// console && console.log( "Transition 'transitionName' start" );
						},
						end: function ( event ) {
							// console && console.log( "Transition 'transitionName' end" );
						}
					},
					Transition2: {
						// origin: '*',
						// destination: '.',
						operation: function () { this.end(); }
					}
				}
			}
		},

		// initial state selector
		initialState === undefined ? 'Waiting' : initialState
	);
};

})( jQuery );