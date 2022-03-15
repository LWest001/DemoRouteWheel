// *
// Make experiment condition before starting experiment
// To each radius value (2^n), assign random scene number.
// Each radius would tested 'n_repeition' times 
// *

// Add prac_or_main parameter so that practice uses ISC2 Leo 3/14/22
function make_condition(radius, n_bin_onWheel, n_repetition, n_block, img_host, wheel_num, prac_or_main) {

    // make empty condition
    var basic_condition = [];

    // put in the route subfolder by Bill 2/10/2022
    // fixed typo (ISC1 vs IS1)
    // Remove shuffling Leo 3/14/22
    // Set up 6 counterbalanced conditions, and a practice condition Leo 3/14/22
    var route = [];

    if (prac_or_main == 00) {
        route = ['ISC2/']
    } else {
        if (CONDITION == 1) {
            route = ['OLM7/', 'JMP3/', 'STB9/'];
        } else if (CONDITION == 2) {
            route = ['OLM7/', 'STB9/', 'JMP3/'];
        } else if (CONDITION == 3) {
            route = ['JMP3/', 'STB9/', 'OLM7/'];
        } else if (CONDITION == 4) {
            route = ['JMP3/', 'OLM7/', 'STB9/'];
        } else if (CONDITION == 5) {
            route = ['STB9/', 'OLM7/', 'JMP3/'];
        } else {
            route = ['STB9/', 'JMP3/', 'OLM7/']
        }
    }

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

    // assign value to each bin in each radius condition for each repetition
    //for (r = 0; r < radius.length; r++) { //put radius out of the loop since not using it for now by Bill 2/10/2022
    for (f = 0; f < route.length; f++) { //put route into the loop to create different block for different route by Bill 2/10/2022
        for (b = 0; b < n_bin_onWheel; b++) {
            var shuffled_jitter = _.shuffle(jitter_option);
            for (rp = 0; rp < n_repetition; rp++) {
                // Remove animation section Leo 3/14/22
                // var target_num = bin_startPoint[b] + shuffled_jitter[rp];
                // var targetSeries = [];
                // for (backCount = 20; backCount > 0; backCount--) {
                //     if (target_num - backCount + 1 >= 0) {
                //         targetSeries.push(img_host + route[f] + ('00000' + (target_num - backCount + 1)).slice(-6) + '.jpg')
                //     } else {
                //         targetSeries.push(img_host + route[f] + ('00000' + (target_num - backCount + 361)).slice(-6) + '.jpg')
                //     }
                // }
                basic_condition.push({
                    //radius: radius[r],//put radius out of the loop since not using it for now by Bill 2/10/2022
                    scene_num: ('00000' + (bin_startPoint[b] + shuffled_jitter[rp])).slice(-6).toString(),
                    wheel_path: img_host + route[f], //Wheel path is the whole folder, so it the image can change base on the mouse, by Bill 11/23/2021 // change to IS2 by Leo 12/2/2021
                    //wheel_path: img_host+'Wheel'+wheel_num+'/wheel'+wheel_num+'_r'+radius[r]+'/', //Wheel path 
                    img_path: img_host + route[f] + ('00000' + (bin_startPoint[b] + shuffled_jitter[rp])).slice(-6) + '.jpg', // img_path is the image for the target, change it to ISC, by Bill 11/23/2021// change to IS2 by Leo 12/2/2021
                    // img_path: img_host+'Wheel'+wheel_num+'/wheel'+wheel_num+'_r'+radius[r]+'/'+
                    //         ('00000'+(bin_startPoint[b]+shuffled_jitter[rp])).slice(-6)+'.webp'   
                    // target_series: targetSeries,
                    route: route[f]
                })
            }

        }
        //put  one route into the one block by Bill 2/10/2022
        final_condition.push(basic_condition)
            // clear up the block for next route by Bill 2/10/2022
        basic_condition = []


    }



    // slice by n_block // final condition will be base on route, remove the block slicing by Bill 2/20/2022
    //var final_condition = _.chunk(_.shuffle(basic_condition), basic_condition.length / n_block);



    return final_condition;


}