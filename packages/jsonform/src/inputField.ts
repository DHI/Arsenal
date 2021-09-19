import { action, computed, makeObservable, observable, reaction } from 'mobx';
import Ajv from 'ajv';

/**
 * An example class, not yet used.
 * */
class InputField<V> {
  constructor(value: V, public options: { schema: any }) {
    makeObservable(this, {
      value: observable,
      errors: observable,
      validate: action.bound,
      isValid: computed,
    });

    reaction(
      () => this.value,
      () => {
        this.validate();
      },
    );
  }

  private ajv = new Ajv();

  value?: V = undefined;

  errors?: Ajv['errors'] = undefined;

  get isValid() {
    return !!this.errors;
  }

  validate = () => {
    const isValid = this.ajv.validate(this.options.schema, this.value);

    if (isValid) return;

    this.errors = this.ajv.errors;
  };
}

class ExampleModel {
  myField = new InputField('', {
    schema: {
      type: 'string',
      pattern: '^[a-zA-Z0-9]*$',
    },
  });
}
