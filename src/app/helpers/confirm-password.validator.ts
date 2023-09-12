import { FormGroup } from "@angular/forms";

export function confirmPasswordValidetor(controlName: string, matchControlNmae: string){

    return (formGroup: FormGroup) =>{
        const passwordControl = formGroup.controls[controlName];
        const confirmPasswordControl = formGroup.controls[matchControlNmae];
        if(confirmPasswordControl.errors && confirmPasswordControl.errors['confirmPasswordValidetor']){
            return;
        }

        if(passwordControl.value !== confirmPasswordControl.value){
            confirmPasswordControl.setErrors({confirmPasswordValidetor: true});
        }else{
            confirmPasswordControl.setErrors(null);
        }
    }
}