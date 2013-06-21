class Mover
  state @::,

    # Programmatically set up the root to log the transitional
    # events of all states
    construct: ->
      events = ['depart', 'exit', 'enter', 'arrive']
      for s in [this].concat @substates true
        for e in events
          do ( s, e ) -> s.on e, state.bind ->
            console.log "#{e} #{@name}"

    Stationary:
      Idle: state 'initial'
      Alert: state
    Moving:
      Walking: state
      Running:
        Sprinting: state

    transitions:
      Announcing: source: '*', target: '*'
        action: state.bind ->
          name = @superstate.name or "the root"
          @end "action of transition is at {name}"
        end: ( message ) -> console.log message


m = new Mover

m.state '-> Alert'
# log <<< "depart Idle"
# log <<< "exit Idle"
# log <<< "action of transition is at Stationary"
# log <<< "enter Alert"
# log <<< "arrive Alert"

m.state '-> Sprinting'
# log <<< "depart Alert"
# log <<< "exit Alert"
# log <<< "exit Stationary"
# log <<< "action of transition is at the root"
# log <<< "enter Moving"
# log <<< "enter Running"
# log <<< "enter Sprinting"
# log <<< "arrive Sprinting"