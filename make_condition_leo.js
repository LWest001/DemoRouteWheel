// *
// Make experiment condition before starting experiment
// To each radius value (2^n), assign random scene number.
// Each radius would tested 'n_repeition' times 
// *

function make_condition(radius, n_bin_onWheel, n_repetition, n_block, img_host, wheel_num) {

    // make empty condition
    var basic_condition = [];

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

    // assign value to each bin in each radius condition for each repetition
    for (r = 0; r < radius.length; r++) {
        for (b = 0; b < n_bin_onWheel; b++) {
            var shuffled_jitter = _.shuffle(jitter_option);
            for (rp = 0; rp < n_repetition; rp++) {
                basic_condition.push({
                    radius: radius[r],
                    scene_num: ('00000' + (bin_startPoint[b] + shuffled_jitter[rp])).slice(-6).toString(),
                    wheel_path: img_host + "ISC2/", //Wheel path is the whole folder, so it can the image can change base on the mouse, by Bill 11/23/2021
                    //wheel_path: img_host+'Wheel'+wheel_num+'/wheel'+wheel_num+'_r'+radius[r]+'/', //Wheel path 
                    img_path: img_host + "ISC2/" + ('00000' + (bin_startPoint[b] + shuffled_jitter[rp])).slice(-6) + '.jpg' // img_path is the image for the target, change it to ISC2, by Bill 11/23/2021
                        // img_path: img_host+'Wheel'+wheel_num+'/wheel'+wheel_num+'_r'+radius[r]+'/'+
                        //         ('00000'+(bin_startPoint[b]+shuffled_jitter[rp])).slice(-6)+'.webp'                         
                })
            }

        }
    }

    // slice by n_block
    var final_condition = _.chunk(_.shuffle(basic_condition), basic_condition.length / n_block);

    return final_condition;


}