/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const Generator = require('yeoman-generator');
const path = require('path');
const process = require('process');

module.exports = class extends Generator {

    async prompting () {
        const questions = [{
            type: 'list',
            name: 'language',
            message: 'Please specify the contract language:',
            choices: [
                { name: 'JavaScript', value: 'javascript' },
                { name: 'TypeScript', value: 'typescript' }
            ],
            when: () => !this.options.language
        }, {
            type: 'input',
            name: 'name',
            message: 'Please specify the contract name:',
            default: path.basename(process.cwd()),
            when: () => !this.options.name
        }, {
            type: 'input',
            name: 'version',
            message: 'Please specify the contract version:',
            default: '0.0.1',
            when: () => !this.options.version
        }, {
            type: 'input',
            name: 'description',
            message: 'Please specify the contract description:',
            when: () => !this.options.description
        }, {
            type: 'input',
            name: 'author',
            message: 'Please specify the contract author:',
            when: () => !this.options.author
        }, {
            type: 'input',
            name: 'license',
            message: 'Please specify the contract license:',
            when: () => !this.options.license
        }];
        const answers = await this.prompt(questions);
        Object.assign(this.options, answers);
    }

    async writing () {
        console.log('Generating files...');
        this.fs.copyTpl(this.templatePath(this.options.language), this._getDestination(), this.options, undefined, { globOptions: { dot: true } });
        // npm install does dumb stuff and renames our gitignore to npmignore, so rename it back!
        this.fs.move(this.destinationPath('.gitignore-hidefromnpm'), this.destinationPath('.gitignore'));
    }

    async install() {
        if(this.options['skip-install'] !== true){
            this.installDependencies({ bower: false, npm: true });
        }
    }

    _getDestination(){
        return (this.options.destination) ? (this.destinationRoot(this.options.destination)) : ((this.destinationRoot()));
    }

    end(){
        console.log('Finished generating contract');
    }
};