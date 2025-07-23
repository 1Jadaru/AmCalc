import { executeQuery, executeQuerySingle } from '../utils/database-pg';

export interface CreateScenarioData {
  name: string;
  principal: number;
  interestRate: number;
  termYears: number;
  paymentFrequency?: string;
  startDate?: Date;
  paymentAmount?: number;
  totalInterest?: number;
  totalPayments?: number;
  amortizationSchedule?: any;
  metadata?: any;
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

export class ScenarioService {
  /**
   * Create a new scenario for a project
   */
  static async createScenario(projectId: string, userId: string, data: CreateScenarioData): Promise<Scenario> {
    console.log('📝 Creating scenario for project:', projectId);
    console.log('📝 Scenario data:', JSON.stringify(data, null, 2));
    
    // First verify the project belongs to the user
    const projectCheck = await executeQuerySingle(
      'SELECT id FROM "Project" WHERE id = $1 AND user_id = $2',
      [projectId, userId]
    );

    if (!projectCheck) {
      console.error('❌ Project not found or access denied:', { projectId, userId });
      throw new Error('Project not found or access denied');
    }

    console.log('✅ Project ownership verified');

    const {
      name,
      principal,
      interestRate,
      termYears,
      paymentFrequency = 'monthly',
      startDate,
      paymentAmount,
      totalInterest,
      totalPayments,
      amortizationSchedule,
      metadata
    } = data;
    
    console.log('📝 About to insert scenario with values:', {
      projectId,
      name,
      principal,
      interestRate,
      termYears,
      paymentFrequency,
      startDate,
      paymentAmount,
      totalInterest,
      totalPayments,
      amortizationScheduleLength: amortizationSchedule?.length,
      metadata
    });
    
    try {
      const now = new Date();
      const result = await executeQuerySingle(
        `INSERT INTO "Scenario" (
          project_id, name, principal, interest_rate, term_years, 
          payment_frequency, start_date, payment_amount, total_interest, 
          total_payments, amortization_schedule, metadata, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
        RETURNING id, project_id, name, principal, interest_rate, term_years, 
                  payment_frequency, start_date, payment_amount, total_interest, 
                  total_payments, amortization_schedule, metadata, created_at, updated_at`,
        [
          projectId,
          name,
          principal,
          interestRate,
          termYears,
          paymentFrequency,
          startDate || null,
          paymentAmount || null,
          totalInterest || null,
          totalPayments || null,
          amortizationSchedule ? JSON.stringify(amortizationSchedule) : null,
          metadata ? JSON.stringify(metadata) : null,
          now,
          now
        ]
      );

      console.log('✅ Scenario created:', result.id);
      
      return this.mapScenarioFromDb(result);
    } catch (dbError: any) {
      console.error('💥 Database insert error:', dbError);
      console.error('💥 DB Error message:', dbError.message);
      console.error('💥 DB Error code:', dbError.code);
      console.error('💥 DB Error detail:', dbError.detail);
      console.error('💥 DB Error constraint:', dbError.constraint);
      console.error('💥 DB Error table:', dbError.table);
      console.error('💥 DB Error column:', dbError.column);
      throw dbError; // Re-throw to be caught by the route handler
    }
  }

  /**
   * Get all scenarios for a project
   */
  static async getProjectScenarios(projectId: string, userId: string): Promise<Scenario[]> {
    console.log('📋 Getting scenarios for project:', projectId);
    
    // First verify the project belongs to the user
    const projectCheck = await executeQuerySingle(
      'SELECT id FROM "Project" WHERE id = $1 AND user_id = $2',
      [projectId, userId]
    );

    if (!projectCheck) {
      throw new Error('Project not found or access denied');
    }
    
    const results = await executeQuery(
      `SELECT id, project_id, name, principal, interest_rate, term_years, 
              payment_frequency, start_date, payment_amount, total_interest, 
              total_payments, amortization_schedule, metadata, created_at, updated_at
       FROM "Scenario" 
       WHERE project_id = $1 
       ORDER BY created_at DESC`,
      [projectId]
    );
    
    console.log('📊 Found scenarios:', results.length);
    
    return results.map(this.mapScenarioFromDb);
  }

  /**
   * Get a specific scenario by ID
   */
  static async getScenarioById(scenarioId: string, userId: string): Promise<Scenario | null> {
    console.log('🔍 Getting scenario:', scenarioId);
    
    const result = await executeQuerySingle(
      `SELECT s.id, s.project_id, s.name, s.principal, s.interest_rate, s.term_years, 
              s.payment_frequency, s.start_date, s.payment_amount, s.total_interest, 
              s.total_payments, s.amortization_schedule, s.metadata, s.created_at, s.updated_at
       FROM "Scenario" s
       JOIN "Project" p ON s.project_id = p.id
       WHERE s.id = $1 AND p.user_id = $2`,
      [scenarioId, userId]
    );

    if (!result) {
      console.log('❌ Scenario not found');
      return null;
    }
    
    console.log('✅ Scenario found:', result.name);
    
    return this.mapScenarioFromDb(result);
  }

  /**
   * Update a scenario
   */
  static async updateScenario(scenarioId: string, userId: string, data: Partial<CreateScenarioData>): Promise<Scenario | null> {
    console.log('📝 Updating scenario:', scenarioId);
    
    // First verify the scenario belongs to a project owned by the user
    const scenarioCheck = await executeQuerySingle(
      `SELECT s.id FROM "Scenario" s
       JOIN "Project" p ON s.project_id = p.id
       WHERE s.id = $1 AND p.user_id = $2`,
      [scenarioId, userId]
    );

    if (!scenarioCheck) {
      console.log('❌ Scenario not found for update');
      return null;
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    if (data.name !== undefined) {
      paramCount++;
      updates.push(`name = $${paramCount}`);
      values.push(data.name);
    }

    if (data.principal !== undefined) {
      paramCount++;
      updates.push(`principal = $${paramCount}`);
      values.push(data.principal);
    }

    if (data.interestRate !== undefined) {
      paramCount++;
      updates.push(`interest_rate = $${paramCount}`);
      values.push(data.interestRate);
    }

    if (data.termYears !== undefined) {
      paramCount++;
      updates.push(`term_years = $${paramCount}`);
      values.push(data.termYears);
    }

    if (data.paymentFrequency !== undefined) {
      paramCount++;
      updates.push(`payment_frequency = $${paramCount}`);
      values.push(data.paymentFrequency);
    }

    if (data.startDate !== undefined) {
      paramCount++;
      updates.push(`start_date = $${paramCount}`);
      values.push(data.startDate);
    }

    if (data.paymentAmount !== undefined) {
      paramCount++;
      updates.push(`payment_amount = $${paramCount}`);
      values.push(data.paymentAmount);
    }

    if (data.totalInterest !== undefined) {
      paramCount++;
      updates.push(`total_interest = $${paramCount}`);
      values.push(data.totalInterest);
    }

    if (data.totalPayments !== undefined) {
      paramCount++;
      updates.push(`total_payments = $${paramCount}`);
      values.push(data.totalPayments);
    }

    if (data.amortizationSchedule !== undefined) {
      paramCount++;
      updates.push(`amortization_schedule = $${paramCount}`);
      values.push(data.amortizationSchedule ? JSON.stringify(data.amortizationSchedule) : null);
    }

    if (data.metadata !== undefined) {
      paramCount++;
      updates.push(`metadata = $${paramCount}`);
      values.push(data.metadata ? JSON.stringify(data.metadata) : null);
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    // Add updated_at
    paramCount++;
    updates.push(`updated_at = $${paramCount}`);
    values.push(new Date());

    // Add WHERE condition
    paramCount++;
    values.push(scenarioId);

    const result = await executeQuerySingle(
      `UPDATE "Scenario" 
       SET ${updates.join(', ')} 
       WHERE id = $${paramCount}
       RETURNING id, project_id, name, principal, interest_rate, term_years, 
                 payment_frequency, start_date, payment_amount, total_interest, 
                 total_payments, amortization_schedule, metadata, created_at, updated_at`,
      values
    );

    if (!result) {
      console.log('❌ Scenario not found for update');
      return null;
    }

    console.log('✅ Scenario updated:', result.name);
    
    return this.mapScenarioFromDb(result);
  }

  /**
   * Delete a scenario
   */
  static async deleteScenario(scenarioId: string, userId: string): Promise<boolean> {
    console.log('🗑️ Deleting scenario:', scenarioId);
    
    // First check if the scenario exists and belongs to a project owned by the user
    const existingScenario = await this.getScenarioById(scenarioId, userId);
    if (!existingScenario) {
      console.log('❌ Scenario not found for deletion');
      return false;
    }

    // Delete the scenario
    await executeQuery(
      'DELETE FROM "Scenario" WHERE id = $1',
      [scenarioId]
    );

    console.log('✅ Scenario deleted');
    return true;
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
