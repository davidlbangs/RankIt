function stv(winners, ballots) {
  
  // helper objects
  var name2totals = {};
  var name2ballots = {};
  var name2weights = {};

  // results arrays
  var rounds = [];
  var elected = [];

  // THRESHOLD
  // Threshold is the number of votes that mathematically guarantees that the candidate cannot lose
  // Ex: 327 ballots / (2 winners + 1) = 109 + 1 = 110.
  // In a 2 winner race with 327 ballots, a candidate with 110 votes is guaranteed victory.
  var threshold = Math.floor(ballots.length/(winners+1))+1;

  // Factor
  // 
  var factor = 1;
  var elim;
  var cans;

  // do...while the winner count is less than the "can win" count.
  do {
    
    // ITERATE OVER EACH BALLOT
    ballots.forEach(function(ballot, i) {
      while (ballot.length) {
        
        // grab the name of the vote and remove from the ballot array.
        var name = ballot.shift(); 

        // if it's the first round, everyone gets through.
        // otherwise, we check to see if name is in name2totals
        if (rounds.length === 0 || name in name2totals) {
          var new_weight = rounds.length === 0 || (name2weights[elim][i] * factor);
          name2ballots[name] = (name2ballots[name] || []);
          name2ballots[name].push(ballot);
          name2weights[name] = (name2weights[name] || []);
          name2weights[name].push(new_weight);
          name2totals[name] = (name2totals[name] || 0) + new_weight;

          break;
        }
      }
    });


    rounds.push({...name2totals});
    var mx = Math.max(...Object.values(name2totals));
    if (threshold <= mx) {
      winners--;
      elim = Object.entries(name2totals).filter(x=>x[1]===mx)[0][0];
      elected.push(elim);
      factor = (mx-threshold)/mx;
    } else {
      var mn = Math.min(...Object.values(name2totals));
      var mn_keys = Object.entries(name2totals).filter(x=>x[1]===mn).map(x=>x[0]);
      elim = mn_keys[parseInt((Math.random())*mn_keys.length)];
      factor = 1;
    }
    ballots = name2ballots[elim]; /* Changing the Reference */
    delete name2totals[elim];

    //  Cans
    // counts the number of potential winners who remain
    cans = Object.keys(name2totals).length;
    console.log(cans, name2totals);

  } while (winners < cans && winners > 0);

  if (winners !== 0) {
    Object.keys(name2totals).forEach(x=>elected.push(x));
  }   
  return {"elected": elected, "rounds": rounds, "threshold": threshold};
} 

