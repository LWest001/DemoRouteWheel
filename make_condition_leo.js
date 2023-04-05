// *
// Make experiment condition before starting experiment
// To each radius value (2^n), assign random scene number.
// Each radius would tested 'n_repeition' times
// *

// Add section parameter so that practice uses ISC2 Leo 3/14/22
function make_condition(
  n_bin_onWheel,
  n_repetition,
  img_host,
  isPracticeBlock
) {
  // make empty condition
  var basic_condition = [];

  // put in the route subfolder by Bill 2/10/2022
  // Remove shuffling, replace with 6 counterbalanced conditions, and a isPcondition Leo 3/14/22
  var conditions = {
    practice: ["ISC2/"],
    1: ["OLM7/", "JMP3/", "STB9/"],
    2: ["OLM7/", "STB9/", "JMP3/"],
    3: ["JMP3/", "STB9/", "OLM7/"],
    4: ["JMP3/", "OLM7/", "STB9/"],
    5: ["STB9/", "OLM7/", "JMP3/"],
    6: ["STB9/", "JMP3/", "OLM7/"],
  };

  var route = isPracticeBlock ? conditions["practice"] : conditions[CONDITION];

  // seed_point on wheel
  var bin_startPoint = [];
  for (i = 0; i < n_bin_onWheel; i++) {
    var bin_width = 360 / n_bin_onWheel;
    bin_startPoint.push(i * bin_width);
  }

  // jitter setting
  var jitter_option = [];
  for (i = 0; i < bin_width; i++) {
    jitter_option.push(i);
  }

  //
  var final_condition = [];

  // put route into the loop to create different block for different route by Bill 2/10/2022
  // add scene_num timeline variable for use in error calculation Leo 3/1
  for (f = 0; f < route.length; f++) {
    for (b = 0; b < n_bin_onWheel; b++) {
      var shuffled_jitter = _.shuffle(jitter_option);
      for (rp = 0; rp < n_repetition; rp++) {
        basic_condition.push({
          scene_num: ("00000" + (bin_startPoint[b] + shuffled_jitter[rp]))
            .slice(-6)
            .toString(),
          wheel_path: img_host + route[f],
          img_path:
            img_host +
            route[f] +
            ("00000" + (bin_startPoint[b] + shuffled_jitter[rp])).slice(-6) +
            ".jpg", // img_path is the image for the target, change it to ISC, by Bill 11/23/2021// change to IS2 by Leo 12/2/2021
          route: route[f],
        });
      }
    }
    //put  one route into the one block by Bill 2/10/2022
    final_condition.push(basic_condition);

    // clear up the block for next route by Bill 2/10/2022
    basic_condition = [];
  }
  return final_condition;
}
