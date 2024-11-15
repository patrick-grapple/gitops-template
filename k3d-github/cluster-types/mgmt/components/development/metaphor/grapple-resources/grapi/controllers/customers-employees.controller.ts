import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Customers,
  Employees,
} from '../models';
import {CustomersRepository} from '../repositories';

export class CustomersEmployeesController {
  constructor(
    @repository(CustomersRepository)
    public customersRepository: CustomersRepository,
  ) { }

  @get('/customers/{id}/employees', {
    responses: {
      '200': {
        description: 'Employees belonging to Customers',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Employees),
          },
        },
      },
    },
  })
  async getEmployees(
    @param.path.number('id') id: typeof Customers.prototype.id,
  ): Promise<Employees> {
    return this.customersRepository.employees(id);
  }
}
