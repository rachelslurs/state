1&&
( function ( $, assert, undefined ) {

module( "State" );

test( "query()", function () {
	var x = new TestObject;
	assert.ok( x.state().query( 'Finished.*', x.state('Finished.CleaningUp') ) );
	assert.ok( x.state().query( 'Finished.*', x.state('Finished.Terminated') ) );
	assert.ok( !x.state().query( 'Finished.*', x.state('Waiting') ) );
	assert.ok( !x.state().query( 'Finished.*', x.state('Finished') ) );
	assert.ok( x.state('Finished').query( '.Terminated', x.state('Finished.Terminated') ) );
	assert.ok( x.state('Finished').query( '.*', x.state('Finished.CleaningUp') ) );
	assert.ok( x.state('Finished').query( '.*', x.state('Finished.Terminated') ) );
	assert.ok( x.state().query( '*', x.state('Finished') ) );
	assert.ok( !x.state().query( '*', x.state('Finished.Terminated') ) );
	assert.ok( x.state().query( '**', x.state('Finished.Terminated') ) );
	assert.ok( x.state('Finished').query( '.*', x.state('Finished.Terminated') ) );
	assert.ok( x.state('Finished').query( '.**', x.state('Finished.Terminated') ) );
	
	assert.strictEqual( x.state().query( 'Finished' ), x.state('Finished') );
	assert.strictEqual( x.state().query( '*' ).length, 3 );
	assert.strictEqual( x.state().query( '**' ).length, 8 );
	assert.strictEqual( x.state('Finished').query( '.Terminated' ), x.state('Finished.Terminated') );
	assert.strictEqual( x.state('Finished').query( '.*' ).length, 2 );
	assert.strictEqual( x.state().query( '*', x.state('Finished') ), true );
	assert.strictEqual( x.state().query( '*', x.state('Finished.CleaningUp') ), false );
	assert.strictEqual( x.state().query( '**', x.state('Finished.CleaningUp') ), true );
	assert.strictEqual( x.state().query( 'Finished.*', x.state('Finished.CleaningUp') ), true );
	assert.strictEqual( x.state().query( 'Finished.*', x.state('Finished.Terminated') ), true );

	x.state().go('Waiting');
	assert.ok( x.state('ReallyDead') === x.state('Finished.Terminated.ReallyDead') );
	assert.ok( x.state('Tweaked') === x.state('Active.Hyperactive.Tweaked') );
	x.state().go('');
	assert.ok( x.state('ReallyDead') === x.state('Finished.Terminated.ReallyDead') );
	assert.ok( x.state('Tweaked') === x.state('Active.Hyperactive.Tweaked') );
	x.state().go('Tweaked');

	function Foo () {
		state( this, {
			A: state( 'initial', {
				B: {}
			}),
			B: {},
			C: {}
		});
	}
	var foo = new Foo;
	assert.ok( foo.state('B').superstate() === foo.state('') );
	assert.ok( foo.state('B').superstate() !== foo.state('A') );
	assert.ok( foo.state('.B').superstate() === foo.state('A') );
	foo.state().go('');
	assert.ok( foo.state('.B').superstate() === foo.state('') );
	assert.ok( foo.state('.C').superstate() === foo.state('') );
});

test( "express() / mutate()", function () {
	var o = {}, keys, id, list;
	function f ( n ) { return f[n] = function () {}; }
	state( o, {
		data: { a:1, b:'two' },
		mutate: function ( event, expr, before, after, delta ) {
			assert.ok( true, "mutate event at root state" );
		},
		S1: {
			data: { a:3, b:'four' },
			run: function () { return 'foo'; },
			tap: 'S2',
			mutate: function ( event, expr, before, after, delta ) {
				assert.ok( true, "mutate event at substate" );
			}
		},
		S2: {
			data: { a:5, b:'six' },
			run: function () { return 'bar'; },
			tap: 'S1'
		}
	});
	
	id = o.state('S1').on( 'mutate', function ( event, expr, before, after, delta ) {
		var index = Z.keys( delta.events.tap )[0],
			compare = { events: { tap: {} } };
		compare.events.tap[ index ] = Z.NIL;
		assert.deepEqual( delta, compare, "delta.events.tap[" + index + "]:NIL" );
	});
	o.state().mutate({ S1:{ events:{ tap:'S3' } } });
	assert.strictEqual( o.state('S1').event('tap'), 2 );
	o.state('S1').off( 'mutate', id );

	keys = Z.keys( o.state('S1').express().events.tap );
	assert.strictEqual( o.state('S1').express().events.tap[ keys[0] ], 'S2' );
	assert.strictEqual( o.state('S1').express().events.tap[ keys[1] ], 'S3' );

	list = {};
	list[ keys[0] ] = list[ keys[1] ] = Z.NIL;
	o.state('S1').mutate({
		events: {
			tap: [ f(0), f(1), f(2), list ]
		}
	});
	assert.strictEqual( o.state('S1').event('tap'), 3 );

	keys = Z.keys( o.state('S1').express().events.tap );
	assert.strictEqual( o.state('S1').express().events.tap[ keys[0] ], f[0] );
	assert.strictEqual( o.state('S1').express().events.tap[ keys[1] ], f[1] );
	assert.strictEqual( o.state('S1').express().events.tap[ keys[2] ], f[2] );
});

test( "superstate()", function () {
	var x = new TestObject;
	assert.strictEqual( x.state('ReallyDead').superstate('Finished'), x.state('Finished') );
	assert.strictEqual( x.state('ReallyDead').superstate(''), x.state().root() );
	assert.strictEqual( x.state('ReallyDead').superstate(), x.state('Terminated') );
	assert.strictEqual( x.state().root().superstate(), undefined );
});

test( "isIn()", function () {
	var x = new TestObject;
	assert.ok( x.state('Waiting').isIn( x.state().root() ) );
	assert.ok( x.state('CleaningUp').isIn( x.state().root() ) );
	assert.ok( x.state('CleaningUp').isIn( x.state('Finished') ) );
	assert.ok( !x.state('CleaningUp').isIn( x.state('Waiting') ) );
	assert.ok( x.state('Finished').isIn( x.state('Finished') ) );
	assert.ok( !x.state('Finished').isIn( x.state('CleaningUp') ) );
	assert.ok( !x.state('Finished').isIn( 'CleaningUp' ) );
	assert.ok( x.state('CleaningUp').isIn( '.' ) );
});

test( "isSuperstateOf()", function () {
	var x = new TestObject;
	assert.ok( x.state().root().isSuperstateOf( x.state('Waiting') ) );
	assert.ok( x.state().root().isSuperstateOf( x.state('CleaningUp') ) );
	assert.ok( x.state('Finished').isSuperstateOf( x.state('CleaningUp') ) );
	assert.ok( !x.state('Finished').isSuperstateOf( x.state('Active') ) );
});

test( "substates()", function () {
	var	x = new TestObject,
		states = x.state().root().substates( true );
	assert.ok( ( states.length == 8 ) );
});

test( "initialSubstate()", function () {
	function Foo () {}
	state( Foo.prototype, {
		Fizzy: state('initial'),
		Buzzy: {}
	});

	Z.inherit( Bar, Foo );
	function Bar () {}
	state( Bar.prototype, {
		Fizzy: {
			Fuzzy: state('initial')
		}
	});

	Z.inherit( Baz, Bar );
	function Baz () {}
	state( Baz.prototype, {
		Buzzy: {
			Bizzy: state('initial')
		}
	});

	Z.inherit( Qux, Baz );
	function Qux () {}
	state( Qux.prototype, {
		Wizzy: {
			Wuzzy: {}
		}
	});

	var	foo = new Foo,
		bar = new Bar,
		baz = new Baz,
		qux = new Qux;
	
	assert.strictEqual( foo.state().name(), 'Fizzy' );
	assert.strictEqual( bar.state().name(), 'Fuzzy' );
	assert.strictEqual( baz.state().name(), 'Bizzy' );
	assert.strictEqual( qux.state().name(), 'Bizzy' );

	assert.ok( foo.state().change('Buzzy') );
	assert.strictEqual( foo.state().name(), 'Buzzy' );
	assert.ok( bar.state().change('Buzzy') );
	assert.strictEqual( bar.state().name(), 'Buzzy' );
	assert.ok( baz.state().change('Fizzy') );
	assert.strictEqual( baz.state().name(), 'Fizzy' );
	assert.ok( qux.state().change('Fizzy') );
	assert.ok( qux.state().isVirtual() );
	assert.strictEqual( qux.state().name(), 'Fizzy' );
});

test( "depth()", function () {
	var x = new TestObject;
	assert.equal( x.state().root().depth(), 0 );
	assert.equal( x.state('Finished.Terminated').depth(), 2 );
});

test( "common()", function () {
	var x = new TestObject;
	assert.equal( x.state('Terminated').common( x.state('Finished') ), x.state('Finished') );
	assert.equal( x.state('Terminated').common( x.state('CleaningUp') ), x.state('Finished') );
	assert.equal( x.state('Terminated').common( x.state('Active') ), x.state().root() );
	assert.equal( x.state().root().common( x.state().root() ), x.state().root() );
	assert.equal( x.state('Active').common( x.state('Terminated') ), x.state().root() );
	assert.equal( x.state('Waiting').common( x.state('Waiting') ), x.state('Waiting') );
	assert.equal( x.state('Finished').common( x.state('CleaningUp') ), x.state('Finished') );
});

test( "removeState()", function () {
	// test simple removal
	// test removal of 'Finished' with substates
	// test removal of 'Finished' while inside a substate
	// test forced bubbling with removal of 'Finished' while inside 'Terminated'
});

})( jQuery, QUnit || require('assert') );
