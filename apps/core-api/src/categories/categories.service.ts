import {Injectable, ConflictException, NotFoundException} from '@nestjs/common';
import {CategoriesRepository} from './categories.repository';
import {Category} from './categories.entity';
import {CreateCategoryDTO, UpdateCategoryDTO} from '@nest-wise/contracts';

@Injectable()
export class CategoriesService {
  // Limit category catalog size for AI prompts to prevent token bloat
  private readonly MAX_CATEGORIES_FOR_AI = 40;

  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async createCategoryForHousehold(householdId: string, categoryData: CreateCategoryDTO): Promise<Category> {
    const nameExists = await this.categoriesRepository.nameExistsForHousehold(categoryData.name, householdId);
    if (nameExists) {
      throw new ConflictException('Naziv kategorije već postoji u ovom domaćinstvu');
    }

    return await this.categoriesRepository.create({
      name: categoryData.name,
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

  /**
   * Get a compact category catalog for AI prompts (max 40 categories)
   * Returns a compact string like "Groceries:c1; Utilities:c2; ..."
   * Limits to 40 categories to keep prompt size manageable (~200-300 tokens)
   */
  async getCategoryPromptCatalog(householdId: string): Promise<string> {
    const categories = await this.categoriesRepository.findByHouseholdId(householdId);
    // Limit to prevent token bloat in AI prompts
    const limitedCategories = categories.slice(0, this.MAX_CATEGORIES_FOR_AI);
    return limitedCategories.map((cat) => `${cat.name}:${cat.id}`).join('; ');
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
