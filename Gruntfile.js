// Main options
var options = {
        appName: "tizenBoilerplate",
        appId: 'SnHl0SrqpF',
        wgtPath: __dirname + '/dist/',
        tvIP: "106.116.154.96",
        tizenCLIPath: "/home/p.pupczyk/tizen-studio",
        tizenScriptPath: "/tools/ide/bin/tizen.sh",
        tvPath: "/home/owner/share/tmp/sdk_tools/tmp/",
        certificateName: "aaaa",
        certificatePath: "/home/p.pupczyk/workspace-studio/.metadata/.plugins/org.tizen.common.sign/profiles.xml"
    };

module.exports = function (grunt) {
    'use strict';
    require('load-grunt-tasks')(grunt, {
        scope: 'devDependencies'
    });

    var SOURCE_PATH = 'src',
        devToolsAdress,
        devToolsPort;

    function findDevToolsPort(err, stdout, stderr, cb) {
      if (err) {
        cb(err);
        return;
      }
      cb();
      devToolsPort = stdout.match(/port: ([0-9]+)/);
      devToolsPort = devToolsPort[1];
      devToolsAdress = options['tvIP'] + ':' + devToolsPort;
      console.log(devToolsAdress)
    }

    grunt.initConfig({
        watch: {
            js: {
                files: [SOURCE_PATH + '/js/**/*.js'],
                tasks: ['webpack']
            },
            sass: {
                files: [SOURCE_PATH + '/scss/**/*.scss'],
                tasks: ['sass']
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 8 versions']
            },
            dist: {
                files: {
                    'dist/css/style.css': 'dist/css/style.css'
                }
            }
        },
        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'dist/css/style.css': SOURCE_PATH + '/scss/main.scss'
                }
            }
        },
        copy: {
            debug: {
                files: [
                    {
                        expand: true,
                        cwd: SOURCE_PATH + '/',
                        src:  ['**', '!scss/**', '!js/**'],
                        dest: 'dist/',
                        dot: true
                    }
                ]
            }
        },
        shell: {
            build: {
                command: [
                    options['tizenCLIPath'] + options['tizenScriptPath'] + ' build-web -- ./dist',
                    options['tizenCLIPath'] + options['tizenScriptPath'] + ' package --sign ' + options['certificateName'] + ' --type wgt -- ./dist/.buildResult',
                    'mv ./dist/.buildResult/' + options['appName'] + '.wgt ./dist/'
                ].join('&&')
            },
            deployTizen_3_0: {
                command: [
                    options['tizenCLIPath'] + '/tools/sdb connect ' + options['tvIP'],
                    options['tizenCLIPath'] + '/tools/sdb push '+ options['wgtPath'] + options['appName'] + '.wgt ' + options['tvPath'],
                    options['tizenCLIPath'] + '/tools/sdb shell 0 vd_appinstall qua ' + options['tvPath'] + options['appName'] + '.wgt',
                    options['tizenCLIPath'] + '/tools/sdb shell 0 debug ' + options['appId'] + '.' + options['appName'] + ' 300'
                ].join('&&'),
                options: {
                    callback: findDevToolsPort
                }
            },
            runDevTools: {
                command: function() {
                    return "google-chrome " + devToolsAdress
                }
            },
            createURLLuncherFolder: {
              command: [
                'node ./config/upgradeVersion.js',
                'mkdir -p url-luncher',
                'cp ./dist/' + options.appName + '.wgt url-luncher',
                'cp ./config/sssp_config.xml url-luncher',
                'ls url-luncher',
                'http-server url-luncher'
              ].join('&&')
            },
            signCertificateToCli: {
              command: options['tizenCLIPath'] + options['tizenScriptPath'] + ' cli-config -g profiles.path=' + options['certificatePath']
            }
        },
        webpack: {
            debug: require("./webpack.config.js")
        }
    });

    grunt.registerTask('build', ['sass', 'autoprefixer', 'webpack', 'copy:debug']);
    grunt.registerTask('build-deploy', ['build', 'shell:build', 'shell:deployTizen_3_0', 'shell:runDevTools']);
    grunt.registerTask('deployWin', ['build-debug', 'shell:deployWin']);
    grunt.registerTask('url-luncher', ['build', 'shell:build', 'shell:createURLLuncherFolder']);
};
