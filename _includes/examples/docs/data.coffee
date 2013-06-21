class Chief
  state @::,
    data:
      mission: 'innovate'
      budget: 10000000000
    Enraged:
      data:
        mission: 'compete'

  constructor: ->
    state this, 'mutable'
      Enraged:
        Thermonuclear:
          data:
            mission: 'destroy'
            budget: Infinity


mobs = new Chief
mobs.state().data()
# >>> { mission: 'innovate', budget: 10000000000 }

mobs.state '-> Enraged'
mobs.state().data target: 'Moogle'
mobs.state().data()
# >>> { target: 'Moogle', mission: 'compete', budget: 10000000000 }

mobs.state().go 'Thermonuclear'
mobs.state().data()
# >>> { target: 'Moogle', mission: 'destroy', budget: Infinity }