import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
    moduleId: module.id,
    templateUrl: 'register-form.component.html'
})
export class RegisterFormComponent implements OnInit
{
    constructor(private _fb: FormBuilder) {}

    public form: FormGroup;

    public submitted: boolean = false;
    public active: boolean = true;
    private validationMessage: Object =  {
        '0': {},
        username: {
            required: '',
            minLength: '',
            maxLength: '',
            unique: ''
        },
        email: {
            required: '',
            minLength: '',
            maxLength: '',
            unique: ''
        },
        password: {
            required: '',
            minLength: ''
        }
    };

    ngOnInit(): void {
        this.buildForm();
    }

    private buildForm() {
        this.form = this._fb.group({
            username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(24)]],
            email: ['', [Validators.required, Validators.maxLength(255)]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
        this.form.valueChanges
            .subscribe(data => this.onValueChanged(data));

        this.onValueChanged();
    }

    private onValueChanged(data?: any) {
        if(!this.form) return;
        const formReg = this.form;

        for (const field in this.formErrors) {
            this.formErrors[field] = '';
            const control = formReg.get(field);

            if (control && control.dirty && !control.valid) {
                const message = this
            }
        }
    }

    formErrors = {
        username: '',
        email: '',
        password: ''
    };

    public validationMessages = {
        'username': {
            'required':      'Name is required.',
            'minlength':     'Name must be at least 4 characters long.',
            'maxlength':     'Name cannot be more than 24 characters long.',
            'forbiddenName': 'Someone named "Bob" cannot be a hero.'
        },
        'email': {
            'required':      'Email is required.',
        },
        'password': {

        }
    };

}