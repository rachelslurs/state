person.greet();                    // >>> "Hello."

person.state('-> Casual');
person.state();                    // >>> State 'Casual'
person.greet();                    // >>> "Hi!"

Person.prototype.state();          // >>> State ''