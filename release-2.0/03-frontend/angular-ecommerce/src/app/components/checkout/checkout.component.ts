import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ShopFormService } from '../../services/shop-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { ShopValidators } from '../../validators/shop-validators';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit{

  // declare form group
  checkOutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  // inject the form builder
  constructor(private formBuilder: FormBuilder, private shopFormService: ShopFormService){}

  ngOnInit(): void {

    // build the form
    this.checkOutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
        email: new FormControl('', 
                              [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a0z]{2,4}$'), ShopValidators.notOnlyWhiteSpace]
        )
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: [''],
      })
    });

    // populate credit card months

    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )
    
    // populate credit card years

    this.shopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    // populate countries

    this.shopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );
  }

  handleMonthsAndYears() {
    
    const creditCardFormGroup = this.checkOutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    // if current year equals the selected year, then start with the current month

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )
  }

  onSubmit(){
      console.log("Handling the submit button");

      if (this.checkOutFormGroup.invalid) {
        this.checkOutFormGroup.markAllAsTouched();
      }

      console.log(this.checkOutFormGroup.get('customer')?.value);

      console.log("The shipping address country is " + this.checkOutFormGroup.get('shippingAddress').value.country.name);
      console.log("The shipping address state is " + this.checkOutFormGroup.get('shippingAddress').value.state.name);
    }

    copyShippingAddressToBillingAddress(event) {

    if (event.target.checked) {
      this.checkOutFormGroup.controls.billingAddress
            .setValue(this.checkOutFormGroup.controls.shippingAddress.value);

      // bug fix for states
      this.billingAddressStates = this.shippingAddressStates;
    }
    else {
      this.checkOutFormGroup.controls.billingAddress.reset();

      // bug fix for states
      this.billingAddressStates = [];
    }
    
  }

  getStates(formGroupName: string) {

    const formGroup = this.checkOutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country code: ${countryName}`);

    this.shopFormService.getStates(countryCode).subscribe(
      data => {
        
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        }
        else{
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup.get('state').setValue(data[0]);
      }
    )
  }

  //this will be used to access the form control
  get firstName() { return this.checkOutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkOutFormGroup.get('customer.lastName'); }
  get email() { return this.checkOutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkOutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkOutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkOutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkOutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkOutFormGroup.get('shippingAddress.country'); }

  get billingAddressStreet() { return this.checkOutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkOutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkOutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkOutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkOutFormGroup.get('billingAddress.country'); }

  get creditCardType() { return this.checkOutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkOutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkOutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkOutFormGroup.get('creditCard.securityCode'); }

}
