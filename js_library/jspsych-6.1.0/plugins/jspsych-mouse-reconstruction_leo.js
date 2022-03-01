/**
 * jspsych-reconstruction
 * jspsych plugin for a reconstruction task where the subject recreates
 * a stimulus from memory, by using computer mouse
 *
 * Gaeun & Mike
 *
 */


jsPsych.plugins['mouse-reconstruction'] = (function() {

    var plugin = {};

    plugin.info = {
        name: 'mouse-reconstruction',
        description: '',
        parameters: {
            div_name: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'DIV that contains wheel',
                default: undefined,
                description: 'DIV property where to-be-adjusted stimuli are presented.'
            },
            starting_value: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Starting value',
                default: 360,
                description: 'The starting value of the stimulus parameter.'
            },
            wheel_path: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Path to the current wheel for this trial',
                default: undefined,
                description: 'A wheel to be preloaded for this trial'
            },
            image_size: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Size of an image',
                default: undefined,
                description: 'Size of an image in html style format (eg. width: xx%).'
            },
            indicator_path: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Path to the indicator stimuli (e.g. handle, color wheel, etc)',
                default: [
                    [],
                    []
                ],
                description: 'A wheel to be preloaded for this trial'
            },
            indicator_size: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Size of an indicator',
                default: [],
                description: 'Size of an indicator in html style format (eg. width: xx%).'
            },
            wait_fix: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Duration of preceiding fixation',
                default: undefined,
                description: 'Fixtion duration before responding started (used for preloading wheel images)'
            },
            fix_color: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Color of preceiding fixation',
                default: 'black',
                description: 'Fixtion color (make it white to hide.)'
            },
            cue_path: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Path to the cue stimuli',
                default: [],
                description: 'In case of using a memory cue, specify the path to cue stimuli.'
            },
            cue_size: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Size of a cue image',
                default: [],
                description: 'Size of a cue image in html style format (eg. width: xx%).'
            },
            //Add in trial duration and response_ends_trial Leo Westebbe 12/16/21
            trial_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Trial duration',
                default: null,
                description: 'How long to show trial before it ends.'
            },
            response_ends_trial: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'Response ends trial',
                default: true,
                description: 'If true, trial will end when subject makes a response.'
            },
            //end add Leo 12/16/21
            cue_div_name: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'DIV that contains wheel',
                default: [],
                description: 'DIV property where cue stimuli are presented.'
            }

        }
    }

    plugin.trial = function(display_element, trial) {

        // * image host * //
        // const img_host = 'https://macklab.dev/resources/sceneWheel/';

        // Fixation while preloading
        var html = '<div id="basic_arena"><div id="' + trial.div_name + '" style="font-size:24px; color:' + trial.fix_color + ';">+</div></div>'
        display_element.innerHTML = html;
        var fixstart = performance.now();

        // preloading images of the current wheel
        var fix_dur = trial.wait_fix;
        var wheel_path = trial.wheel_path;
        var images = []
        for (i = 0; i < 361; i++) {
            images.push(
                wheel_path + ("000000" + i).slice(-6) + '.jpg' // Change to back to wheel path, by Bill on 11/23/2021
                //wheel_path+("000000"+i).slice(-6)+'.webp'
            );
        }
        jsPsych.pluginAPI.preloadImages(images, wait_fix)

        function wait_fix() {
            var diff = performance.now() - fixstart;
            if (diff > fix_dur) {
                run_trial();
            } else {
                jsPsych.pluginAPI.setTimeout(run_trial, fix_dur - diff);
            }
        }
        // increment trial counter for each trial Leo 2/28
        trialCount += 1

        // Run adjustment trial (draw images according to mouse position)
        function run_trial() {
            // start time
            var start_time = performance.now();

            // random wheel starting point
            var wsp = Math.floor(Math.random() * 360);

            // current param (will be continuously updated)
            var param = trial.starting_value;

            // Send current param to display function   
            function draw(param) {
                // make initial display with the wheel without indicator bar         
                if (param == 360) {
                    var indicator = trial.indicator_path[0];
                } else {
                    var indicator = trial.indicator_path[1];
                }

                // var html = trial.stim_function(param, wsp); // <- this is for when stimuli are drawn outside this plugin
                sceneNum = ("000000" + param).slice(-6);
                var html = '<div id="basic_arena"><div id="' + trial.div_name + '">' +
                    //'<img src="ISC2/'+sceneNum+'.jpg" style="'+trial.image_size+'"></div>'+  // change the image path by Bill 11/22/2021 //This line is remove becasue we need to read image from host By Bill 12/08/2021  
                    '<img src="' + wheel_path + sceneNum + '.jpg" style="' + trial.image_size + '"></div>' + // scene, // change it back to wheel path so it can read data from te host 11/23/2021 by Bill
                    //'<img src="'+wheel_path+sceneNum+'.webp" style="'+trial.image_size+'"></div>'+  // scene    
                    '<div id="' + trial.div_name + '"><img src="' + indicator + '" ' + // indicator
                    'style="' + trial.indicator_size + '; transform: rotate(' + (param + wsp) + 'deg)"></div>' +
                    '<div id="' + trial.cue_div_name + '">' + // cue
                    '<img src="' + trial.cue_path + '" style="margin:auto; ' + trial.cue_size + '"></div></div>';

                display_element.innerHTML = html;
            }

            // Get mouse position and param(current angle pointed by mouse)
            var mousemovementevent = function(e) {
                var x = e.clientX - container_centerX;
                var y = e.clientY - container_centerY;
                mouse_angle = Math.floor((Math.atan2(y, x) * 180 / Math.PI + 360) % 360); // in positive, integer, degree unit
                param = ((mouse_angle - wsp + 360) % 360); // "+360 %360" is to make scene index a positive value

                // refresh the display
                draw(param);
            }
            document.addEventListener('mousemove', mousemovementevent);


            // Finish trial
            var mouseclickevent = function() {
                    document.removeEventListener('mousemove', mousemovementevent);
                    var end_time = performance.now();
                    var response_time = end_time - start_time;
                    var final_angle = param;
                    // Add trialCount to data record Leo 2/28
                    var trial_data = {
                        "trial_num": trialCount,
                        "fix_duration": start_time - fixstart,
                        "rt": response_time,
                        "response": final_angle
                    };

                    display_element.innerHTML = "";

                    document.removeEventListener("click", mouseclickevent);

                    // next trial
                    // jsPsych.finishTrial(trial_data);} // need to use end_trial for trial duration Leo 2/21/22
                    if (trial.response_ends_trial) {
                        end_trial(trial_data);
                    }

                }
                // add in the function to end trial when it is time by Bill 12/12/2021
            function end_trial(data) {

                // kill any remaining setTimeout handlers
                jsPsych.pluginAPI.clearAllTimeouts();

                // kill keyboard listeners
                if (typeof keyboardListener !== 'undefined') {
                    jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
                }
                // kill mouse listeners
                document.removeEventListener('mousemove', mousemovementevent);
                document.removeEventListener("click", mouseclickevent);

                // gather the data to store for the trial
                trial_data = data;

                // clear the display
                display_element.innerHTML = '';

                // move on to the next trial
                jsPsych.finishTrial(trial_data);
            };
            document.addEventListener("click", mouseclickevent);

            // initial draw
            draw(param);

            // Get center coordinates of the adjustment task container
            var arena = document.getElementById(trial.div_name);
            var rect = arena.getBoundingClientRect();
            var container_centerX = rect.left + rect.width / 2;
            var container_centerY = rect.top + rect.height / 2;

            //add in trial_duration Leo Westebbe 12/16/2021
            // end trial if trial_duration is set
            if (trial.trial_duration !== null) {
                trial_data = {
                    "trial_num": trialCount,
                    "fix_duration": "NaN",
                    "rt": "NaN",
                    "response": "NaN"
                }
                jsPsych.pluginAPI.setTimeout(function() {
                    end_trial(trial_data);
                }, trial.trial_duration);
            }
        }
    };
    return plugin;
})();