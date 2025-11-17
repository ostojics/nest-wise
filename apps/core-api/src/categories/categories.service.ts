import {Injectable, ConflictException, NotFoundException} from '@nestjs/common';
import {CategoriesRepository} from './categories.repository';
import {Category} from './categories.entity';
import {CreateCategoryDTO, UpdateCategoryDTO} from '@nest-wise/contracts';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async createCategoryForHousehold(householdId: string, categoryData: CreateCategoryDTO): Promise<Category> {
    const nameExists = await this.categoriesRepository.nameExistsForHousehold(categoryData.name, householdId);
    if (nameExists) {
      throw new ConflictException('Naziv kategorije već postoji u ovom domaćinstvu');
    }

    // If setting this category as default, clear any existing default
    if (categoryData.default === true) {
      await this.categoriesRepository.clearDefaultForHousehold(householdId);
    }

    return await this.categoriesRepository.create({
      name: categoryData.name,
      description: categoryData.description,
      householdId,
      default: categoryData.default,
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

    // If setting this category as default, clear any existing default
    if (categoryData.default === true) {
      await this.categoriesRepository.clearDefaultForHousehold(existingCategory.householdId);
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
