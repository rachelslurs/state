# State.js
*This is a modified fork of @nickfargo's repo to provide documentation while he gets his documentation site going again. See gh-pages branch for changes.*

**[State][0]** is a JavaScript library for implementing **[first-class states][1]** on arbitrary **owner** objects.

A `State` is a module of behavior — **[expressed][2]** as definitions of **[methods][3]**, **[data][4]**, and/or **[events][5]** — that can be exhibited by its owner. The **State** **[object model][6]** provides for **[hierarchical][7]**, **[compositional][8]**, and **[indirect prototypal][9]** relations between `State`s, facilitating a variety of patterns for reuse and modularity.

![State object model](http://rachelslurs.github.io/state/img/model-4-75pct.png)

An owner object exhibits the behavior expressed by its **current state** — method calls the owner receives are automatically dispatched to methods defined or inherited by that `State`. Behavior of the owner is altered by executing **[transitions][10]** that carry its current state reference from one of its `State`s to another.

* * *

Visit **[statejs.org][]** for an introduction, with sample code, comprehensive [documentation][] including a [getting started][] guide and conceptual [overview][], [API][] reference, and [annotated source][].

### &#x1f44b;




[0]: http://rachelslurs.github.io/state/
[1]: http://rachelslurs.github.io/state/docs/#concepts--states
[2]: http://rachelslurs.github.io/state/docs/#concepts--expressions
[3]: http://rachelslurs.github.io/state/docs/#concepts--methods
[4]: http://rachelslurs.github.io/state/docs/#concepts--data
[5]: http://rachelslurs.github.io/state/docs/#concepts--events
[6]: http://rachelslurs.github.io/state/docs/#concepts--object-model
[7]: http://rachelslurs.github.io/state/docs/#concepts--object-model--superstates-and-substates
[8]: http://rachelslurs.github.io/state/docs/#concepts--object-model--parastates-and-composition
[9]: http://rachelslurs.github.io/state/docs/#concepts--object-model--protostates-and-epistates
[10]: http://rachelslurs.github.io/state/docs/#concepts--transitions

[statejs.org]:       http://rachelslurs.github.io/state/
[documentation]:     http://rachelslurs.github.io/state/docs/
[getting started]:   http://rachelslurs.github.io/state/docs/#getting-started
[overview]:          http://rachelslurs.github.io/state/docs/#overview
[API]:               http://rachelslurs.github.io/state/api/
[annotated source]:  http://rachelslurs.github.io/state/source/
