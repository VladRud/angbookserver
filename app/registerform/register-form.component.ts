import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService, AlertService } from '../_services/index';
import { User } from "../_models/user";

@Component({
    moduleId: module.id,
    templateUrl: 'register-form.component.html'
})
export class RegisterFormComponent
{
    public form: FormGroup;

    private validationTimeout: any;

    public windowIsRegistration: boolean = false;

    public formErrors: any = {
        username: [],
        email: [],
        password: []
    };

    private validationMessages = {
        username: {
            'required':      'Name is required.',
            'minlength':     'Name must be at least 4 characters long.',
            'maxlength':     'Name cannot be more than 25 characters long.',
            'valid':         'Name not valid',
            'unique':        'Name is used'
        },
        email: {
            'required':      'Email is required.',
            'maxlength':     'Email cannot be more than 255 characters long.',
            'email':         'Email not valid',
            'unique':        'Email is used'
        },
        password: {
            'required':      'Password is required.',
            'minlength':     'Name must be at least 5 characters long.',
        }
    };

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private userService: UserService,
        private alertService: AlertService
    ) {
        this.form = this.fb.group({
            username: [
                '',
                [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(25)
                ]
            ],
            email: [
                '',
                [
                    Validators.required,
                    Validators.maxLength(255),
                    Validators.email
                ]
            ],
            password: [
                '',
                [
                    Validators.required,
                    Validators.minLength(6)
                ]
            ]
        });

        this.form.valueChanges
            .subscribe((data: any) => this.validateForm(true));

        this.validateForm(false);
    }

    private validateForm(typing: boolean = false): void {
        if (!this.form) {
            return;
        }

        if (typing == true) {
            clearTimeout(this.validationTimeout);
            this.validationTimeout = setTimeout(
                () => {
                    this.validateForm(false);
                },
                500
            );
            return;
        }

        if (this.validationTimeout) {
            clearTimeout(this.validationTimeout);
        }

        this.checkErrors();
    }

    private checkErrors(): void {
        const form: FormGroup = this.form;

        for (const field in this.formErrors) {
            if (this.formErrors.hasOwnProperty(field)) {
                this.formErrors[field] = [];
                const control: AbstractControl = form.get(field);

                if (control && control.dirty && !control.valid) {
                    const messages: Object = this.validationMessages[field];

                    for (const key in control.errors) {
                        if (control.errors.hasOwnProperty(key)) {
                            this.formErrors[field].push(messages[key]);
                        }
                    }
                }
            }
        }
    }

    public doSubmit(): void {
        const formValid: boolean = this.checkFormIsValid();

        if(!formValid) { return; }

        this.registerUser(this.form.value);
    }

    private registerUser(user: User): void {
        this.userService.create(user).subscribe(
            data => {
                if(data.errors) {
                    this.parseBackendErrors(data.errors);
                } else {
                    this.alertService.success('Registration successful', true);
                    this.router.navigate(['/login']);
                }
            },
            error => {
                this.alertService.error(error);
            }
        )
    }

    private parseBackendErrors(errors: Object): void {
        const parseErrors: Object = errors;

        for (const field in parseErrors) {
            if (parseErrors.hasOwnProperty(field)) {
                const messages: Object = this.validationMessages[field];
                this.formErrors[field] = [];

                for (const errorName of parseErrors[field]) {
                    this.formErrors[field].push(messages[errorName]);
                }
            }
        }
    }

    private checkFormIsValid(): boolean {
        const form: FormGroup = this.form;

        for (const field in this.formErrors) {
            if (this.formErrors.hasOwnProperty(field)) {
                const control: AbstractControl = form.get(field);

                if (control && !control.dirty) {
                    control.markAsDirty();
                }
            }
        }

        this.checkErrors();

        return this.form.valid;
    }

 }