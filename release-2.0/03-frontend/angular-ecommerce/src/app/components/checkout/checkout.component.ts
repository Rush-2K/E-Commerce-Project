import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit{

  // declare form group
  checkOutFormGroup!: FormGroup;

  // inject the form builder
  constructor(private formBuilder: FormBuilder){}

  ngOnInit(): void {

    // build the form
    this.checkOutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
      })
    });
  }

  onSubmit(){
      console.log("Handling the submit button");
      console.log(this.checkOutFormGroup.get('customer')?.value);
    }

    copyShippingAddressToBillingAddress(event) {

    if (event.target.checked) {
      this.checkOutFormGroup.controls.billingAddress
            .setValue(this.checkOutFormGroup.controls.shippingAddress.value);
    }
    else {
      this.checkOutFormGroup.controls.billingAddress.reset();
    }
    
  }

}
