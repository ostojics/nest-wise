import {Injectable, ConflictException, NotFoundException, Inject} from '@nestjs/common';
import {Category} from './categories.entity';
import {CreateCategoryDTO, UpdateCategoryDTO} from '@nest-wise/contracts';
import {ICategoryRepository, CATEGORY_REPOSITORY} from '../repositories/category.repository.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoriesRepository: ICategoryRepository,
  ) {}

  async createCategoryForHousehold(householdId: string, categoryData: CreateCategoryDTO): Promise<Category> {
    const nameExists = await this.categoriesRepository.nameExistsForHousehold(categoryData.name, householdId);
    if (nameExists) {
      throw new ConflictException('Naziv kategorije već postoji u ovom domaćinstvu');
    }

    return await this.categoriesRepository.create({
      name: categoryData.name,
      description: categoryData.description,
      householdId,
    });
  }

  async findCategoryById(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Kategorija nije pronađena');
    }

    return category;
  }

  async findCategoriesByHouseholdId(householdId: string): Promise<Category[]> {
    return await this.categoriesRepository.findByHouseholdId(householdId);
  }

  async findAllCategories(): Promise<Category[]> {
    return await this.categoriesRepository.findAll();
  }

  async updateCategory(id: string, categoryData: UpdateCategoryDTO): Promise<Category> {
    const existingCategory = await this.categoriesRepository.findById(id);
    if (!existingCategory) {
      throw new NotFoundException('Kategorija nije pronađena');
    }

    if (categoryData.name && categoryData.name !== existingCategory.name) {
      const nameExists = await this.categoriesRepository.nameExistsForHousehold(
        categoryData.name,
        existingCategory.householdId,
      );
      if (nameExists) {
        throw new ConflictException('Naziv kategorije već postoji u ovom domaćinstvu');
      }
    }

    const updatedCategory = await this.categoriesRepository.update(id, categoryData);
    if (!updatedCategory) {
      throw new NotFoundException('Kategorija nije pronađena');
    }

    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<void> {
    const deleted = await this.categoriesRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Kategorija nije pronađena');
    }
  }
}
