import { executeQuery, executeQuerySingle } from '../utils/database-pg';

export interface CreateProjectData {
  name: string;
  description?: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  scenarios?: Scenario[];
  scenarioCount?: number;
}

export interface Scenario {
  id: string;
  projectId: string;
  name: string;
  principal: number;
  interestRate: number;
  termYears: number;
  paymentFrequency: string;
  startDate: Date | null;
  paymentAmount: number | null;
  totalInterest: number | null;
  totalPayments: number | null;
  amortizationSchedule: any;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  isArchived?: boolean;
}

export class ProjectService {
  /**
   * Create a new project for a user
   */
  static async createProject(userId: string, data: CreateProjectData): Promise<Project> {
    const { name, description } = data;
    
    console.log('📝 Creating project for user:', userId);
    
    const result = await executeQuerySingle(
      `INSERT INTO "Project" (user_id, name, description) 
       VALUES ($1, $2, $3) 
       RETURNING id, user_id, name, description, is_archived, created_at, updated_at`,
      [userId, name, description || null]
    );

    console.log('✅ Project created:', result.id);
    
    return this.mapProjectFromDb(result);
  }

  /**
   * Get all projects for a user
   */
  static async getUserProjects(userId: string, includeArchived = false): Promise<Project[]> {
    console.log('📋 Getting projects for user:', userId);
    
    let query = `
      SELECT p.id, p.user_id, p.name, p.description, p.is_archived, p.created_at, p.updated_at,
             COUNT(s.id) as scenario_count
      FROM "Project" p
      LEFT JOIN "Scenario" s ON p.id = s.project_id
      WHERE p.user_id = $1
    `;
    
    const params = [userId];
    
    if (!includeArchived) {
      query += ' AND p.is_archived = false';
    }
    
    query += ' GROUP BY p.id, p.user_id, p.name, p.description, p.is_archived, p.created_at, p.updated_at';
    query += ' ORDER BY p.created_at DESC';
    
    const results = await executeQuery(query, params);
    
    console.log('📊 Found projects:', results.length);
    
    return results.map(result => {
      const project = this.mapProjectFromDb(result);
      project.scenarioCount = parseInt(result.scenario_count || '0');
      return project;
    });
  }

  /**
   * Get a specific project by ID (with user ownership check)
   */
  static async getProjectById(projectId: string, userId: string): Promise<Project | null> {
    console.log('🔍 Getting project:', projectId, 'for user:', userId);
    
    const result = await executeQuerySingle(
      `SELECT id, user_id, name, description, is_archived, created_at, updated_at
       FROM "Project" 
       WHERE id = $1 AND user_id = $2`,
      [projectId, userId]
    );

    if (!result) {
      console.log('❌ Project not found');
      return null;
    }
    
    console.log('✅ Project found:', result.name);
    
    // Get scenarios for this project
    const scenarios = await executeQuery(
      `SELECT id, project_id, name, principal, interest_rate, term_years, 
              payment_frequency, start_date, payment_amount, total_interest, 
              total_payments, amortization_schedule, metadata, created_at, updated_at
       FROM "Scenario" 
       WHERE project_id = $1 
       ORDER BY created_at DESC`,
      [projectId]
    );

    console.log('📊 Found scenarios:', scenarios.length);
    
    const project = this.mapProjectFromDb(result);
    project.scenarios = scenarios.map(this.mapScenarioFromDb);
    project.scenarioCount = scenarios.length;
    
    return project;
  }

  /**
   * Update a project
   */
  static async updateProject(projectId: string, userId: string, data: UpdateProjectData): Promise<Project | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    if (data.name !== undefined) {
      paramCount++;
      updates.push(`name = $${paramCount}`);
      values.push(data.name);
    }

    if (data.description !== undefined) {
      paramCount++;
      updates.push(`description = $${paramCount}`);
      values.push(data.description);
    }

    if (data.isArchived !== undefined) {
      paramCount++;
      updates.push(`is_archived = $${paramCount}`);
      values.push(data.isArchived);
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    // Add updated_at
    paramCount++;
    updates.push(`updated_at = $${paramCount}`);
    values.push(new Date());

    // Add WHERE conditions
    paramCount++;
    values.push(projectId);
    paramCount++;
    values.push(userId);

    console.log('📝 Updating project:', projectId);

    const result = await executeQuerySingle(
      `UPDATE "Project" 
       SET ${updates.join(', ')} 
       WHERE id = $${paramCount - 1} AND user_id = $${paramCount}
       RETURNING id, user_id, name, description, is_archived, created_at, updated_at`,
      values
    );

    if (!result) {
      console.log('❌ Project not found for update');
      return null;
    }

    console.log('✅ Project updated:', result.name);
    
    return this.mapProjectFromDb(result);
  }

  /**
   * Delete a project (with cascade to scenarios)
   */
  static async deleteProject(projectId: string, userId: string): Promise<boolean> {
    console.log('🗑️ Deleting project:', projectId);
    
    // First check if the project exists and belongs to the user
    const existingProject = await this.getProjectById(projectId, userId);
    if (!existingProject) {
      console.log('❌ Project not found for deletion');
      return false;
    }

    // Delete the project
    await executeQuery(
      'DELETE FROM "Project" WHERE id = $1 AND user_id = $2',
      [projectId, userId]
    );

    console.log('✅ Project deleted');
    return true;
  }

  /**
   * Map database result to Project interface
   */
  private static mapProjectFromDb(dbProject: any): Project {
    return {
      id: dbProject.id,
      userId: dbProject.user_id,
      name: dbProject.name,
      description: dbProject.description,
      isArchived: dbProject.is_archived,
      createdAt: new Date(dbProject.created_at),
      updatedAt: new Date(dbProject.updated_at)
    };
  }

  /**
   * Map database result to Scenario interface
   */
  private static mapScenarioFromDb(dbScenario: any): Scenario {
    return {
      id: dbScenario.id,
      projectId: dbScenario.project_id,
      name: dbScenario.name,
      principal: parseFloat(dbScenario.principal),
      interestRate: parseFloat(dbScenario.interest_rate),
      termYears: dbScenario.term_years,
      paymentFrequency: dbScenario.payment_frequency,
      startDate: dbScenario.start_date ? new Date(dbScenario.start_date) : null,
      paymentAmount: dbScenario.payment_amount ? parseFloat(dbScenario.payment_amount) : null,
      totalInterest: dbScenario.total_interest ? parseFloat(dbScenario.total_interest) : null,
      totalPayments: dbScenario.total_payments ? parseFloat(dbScenario.total_payments) : null,
      amortizationSchedule: dbScenario.amortization_schedule,
      metadata: dbScenario.metadata,
      createdAt: new Date(dbScenario.created_at),
      updatedAt: new Date(dbScenario.updated_at)
    };
  }
}
