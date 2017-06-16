// Main options
var options = {
        appName: "tizenBoilerplate",
        appId: 'SnHl0SrqpF',
        wgtPath: __dirname + '/dist/',
        tvIP: "106.116.153.189",
        tizenCLIPath: "/home/p.pupczyk/tizen-sdk",
        tizenScriptPath: "/tools/ide/bin/tizen.sh",
        certificate: "local"
    };

module.exports = function (grunt) {
    'use strict';
    require('load-grunt-tasks')(grunt, {
        scope: 'devDependencies'
    });

    var SOURCE_PATH = 'src';

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
                    options['tizenCLIPath'] + options['tizenScriptPath'] + ' package --sign ' + options['certificate'] + ' --type wgt -- ./dist/.buildResult',
                    'mv ./dist/.buildResult/' + options['appName'] + '.wgt ./dist/'
                ].join('&&')
            },
            deploy: {
                command: [
                    options['tizenCLIPath'] + '/tools/sdb connect ' + options['tvIP'],
                    options['tizenCLIPath'] + '/tools/sdb push "'+ options['wgtPath'] + options['appName'] + '.wgt' + '" "/opt/usr/apps/tmp"',
                    options['tizenCLIPath'] + '/tools/sdb shell 0 vd_appinstall appis "/opt/usr/apps/tmp/' + options['appName'] + '.wgt"',
                    options['tizenCLIPath'] + '/tools/sdb shell 0 debug ' + options['appId'] + '.' + options['appName'] + ' 300'
                ].join('&&')
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
        },
        webpack: {
            debug: require("./webpack.config.js")
        }
    });

    grunt.registerTask('build', ['sass', 'autoprefixer', 'webpack', 'copy:debug']);

    grunt.registerTask('deploy', ['build', 'shell:build', 'shell:deploy']);
    grunt.registerTask('deployWin', ['build-debug', 'shell:deployWin']);
    grunt.registerTask('urlluncher', ['build', 'shell:build', 'shell:createURLLuncherFolder']);

};
