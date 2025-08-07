
interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port?: number;
}

// Table interface to represent database tables
interface Table<T> {
  name: string;
  records: T[];
  primaryKey: string;
}

// Query interface to simulate SQL queries
interface Query {
  select?: string[];
  from: string;
  where?: Record<string, any>;
  orderBy?: string;
  limit?: number;
  values?: any[];
}

// This is a mock implementation that simulates MySQL server behavior using localStorage
export class DatabaseService {
  private config: DatabaseConfig;
  private tables: Record<string, Table<any>> = {};
  private isConnected: boolean = false;
  private connectionId: string = '';

  constructor(config: DatabaseConfig) {
    this.config = config;
    this.connect();
    this.initializeDatabase();
  }

  // Simulate MySQL connection
  private connect(): void {
    console.log(`Connecting to MySQL server at ${this.config.host}:${this.config.port || 3306}...`);
    // Simulate connection delay
    setTimeout(() => {
      this.isConnected = true;
      this.connectionId = `mysql-${Math.random().toString(36).substring(2, 15)}`;
      console.log(`Connected to MySQL server. Connection ID: ${this.connectionId}`);
    }, 100);
  }

  // Initialize database with tables
  private initializeDatabase(): void {
    // Create users table
    this.createTable('users', 'id', this.loadTableData('users') || [
      {
        id: "admin-1",
        name: "Admin User",
        email: "admin@example.com",
        password: "password",
        role: "admin",
        avatar: "https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff",
        created_at: new Date().toISOString()
      },
      {
        id: "accountant-1",
        name: "Accountant User",
        email: "accountant@example.com",
        password: "password",
        role: "accountant",
        avatar: "https://ui-avatars.com/api/?name=Accountant+User&background=27AE60&color=fff",
        created_at: new Date().toISOString()
      },
      {
        id: "student-1",
        name: "John Doe",
        email: "student@example.com",
        password: "password",
        role: "student",
        avatar: "https://ui-avatars.com/api/?name=John+Doe&background=F39C12&color=fff",
        created_at: new Date().toISOString()
      }
    ]);

    // Create applications table
    this.createTable('applications', 'id', this.loadTableData('applications') || []);

    // Create documents table
    this.createTable('documents', 'id', this.loadTableData('documents') || []);
    
    // Create payments table
    this.createTable('payments', 'id', this.loadTableData('payments') || []);
  }

  // Load table data from localStorage
  private loadTableData(tableName: string): any[] | null {
    const data = localStorage.getItem(`mysql_${this.config.database}_${tableName}`);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error(`Error parsing table data for ${tableName}:`, error);
        return null;
      }
    }
    return null;
  }

  // Save table data to localStorage
  private saveTableData(tableName: string, data: any[]): void {
    localStorage.setItem(`mysql_${this.config.database}_${tableName}`, JSON.stringify(data));
  }

  // Create a new table
  private createTable<T>(name: string, primaryKey: string, initialData: T[] = []): void {
    this.tables[name] = {
      name,
      records: initialData,
      primaryKey
    };
    // Persist the table data
    this.saveTableData(name, initialData);
  }

  // Execute a query (simplified SQL-like query execution)
  async query<T>(queryString: string, values?: any[]): Promise<T[]> {
    console.log(`Executing query: ${queryString}`, values);
    
    // Simulate query delay
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Very simple SQL parser - this is a basic implementation
    try {
      // Handle SELECT queries
      if (queryString.trim().toUpperCase().startsWith('SELECT')) {
        // Parse SELECT query
        const fromIndex = queryString.toUpperCase().indexOf(' FROM ');
        const tableName = queryString.substring(fromIndex + 6).trim().split(' ')[0];
        
        // Check if table exists
        if (!this.tables[tableName]) {
          throw new Error(`Table '${tableName}' does not exist`);
        }
        
        let result = [...this.tables[tableName].records];
        
        // Handle WHERE clause (very simplified)
        if (queryString.toUpperCase().includes(' WHERE ')) {
          const whereClause = queryString.substring(queryString.toUpperCase().indexOf(' WHERE ') + 7);
          const condition = whereClause.split('=');
          
          if (condition.length === 2) {
            const field = condition[0].trim();
            let value = condition[1].trim();
            
            // Remove any trailing parts (ORDER BY, etc.)
            if (value.includes(' ')) {
              value = value.split(' ')[0];
            }
            
            // Remove quotes if present
            if ((value.startsWith("'") && value.endsWith("'")) || 
                (value.startsWith('"') && value.endsWith('"'))) {
              value = value.substring(1, value.length - 1);
            }
            
            // If using parameterized query with ?
            if (value === '?' && values && values.length > 0) {
              value = values[0];
            }
            
            result = result.filter(record => 
              String(record[field]).toLowerCase() === String(value).toLowerCase()
            );
          }
        }
        
        return result as T[];
      } 
      // Handle INSERT queries
      else if (queryString.trim().toUpperCase().startsWith('INSERT INTO')) {
        const match = queryString.match(/INSERT INTO ([^\s]+)/i);
        if (!match || !match[1]) {
          throw new Error('Invalid INSERT statement');
        }
        
        const tableName = match[1];
        
        // Check if table exists
        if (!this.tables[tableName]) {
          throw new Error(`Table '${tableName}' does not exist`);
        }
        
        // Extract values
        if (!values || !values.length) {
          throw new Error('No values provided for INSERT statement');
        }
        
        // Create record from values
        const fieldNames = this.extractFieldsFromInsert(queryString);
        const record = this.createRecordFromValues(fieldNames, values);
        
        // Add record to table
        this.tables[tableName].records.push(record);
        
        // Persist the updated table
        this.saveTableData(tableName, this.tables[tableName].records);
        
        return [{ insertId: record[this.tables[tableName].primaryKey] }] as any;
      }
      // Handle UPDATE queries
      else if (queryString.trim().toUpperCase().startsWith('UPDATE')) {
        const match = queryString.match(/UPDATE ([^\s]+)/i);
        if (!match || !match[1]) {
          throw new Error('Invalid UPDATE statement');
        }
        
        const tableName = match[1];
        
        // Check if table exists
        if (!this.tables[tableName]) {
          throw new Error(`Table '${tableName}' does not exist`);
        }
        
        // Find WHERE clause
        const whereIndex = queryString.toUpperCase().indexOf(' WHERE ');
        if (whereIndex === -1) {
          throw new Error('UPDATE statement must include a WHERE clause');
        }
        
        // Parse set values
        const setClause = queryString.substring(
          queryString.toUpperCase().indexOf(' SET ') + 5,
          whereIndex
        );
        
        const whereClause = queryString.substring(whereIndex + 7);
        const whereCondition = whereClause.split('=');
        
        if (whereCondition.length !== 2) {
          throw new Error('Invalid WHERE clause in UPDATE statement');
        }
        
        const whereField = whereCondition[0].trim();
        let whereValue = whereCondition[1].trim();
        
        // Handle parameterized query
        if (whereValue === '?' && values && values.length > 0) {
          whereValue = values[values.length - 1];
        }
        
        // Parse fields to update
        const setFields = this.parseSetClause(setClause, values);
        
        // Find and update records
        let updatedCount = 0;
        this.tables[tableName].records = this.tables[tableName].records.map(record => {
          if (String(record[whereField]).toLowerCase() === String(whereValue).toLowerCase()) {
            updatedCount++;
            return { ...record, ...setFields };
          }
          return record;
        });
        
        // Persist the updated table
        this.saveTableData(tableName, this.tables[tableName].records);
        
        return [{ affectedRows: updatedCount }] as any;
      }
      // Handle DELETE queries
      else if (queryString.trim().toUpperCase().startsWith('DELETE')) {
        const fromIndex = queryString.toUpperCase().indexOf(' FROM ');
        const tableName = queryString.substring(fromIndex + 6).trim().split(' ')[0];
        
        // Check if table exists
        if (!this.tables[tableName]) {
          throw new Error(`Table '${tableName}' does not exist`);
        }
        
        // Find WHERE clause
        const whereIndex = queryString.toUpperCase().indexOf(' WHERE ');
        if (whereIndex === -1) {
          throw new Error('DELETE statement must include a WHERE clause');
        }
        
        const whereClause = queryString.substring(whereIndex + 7);
        const whereCondition = whereClause.split('=');
        
        if (whereCondition.length !== 2) {
          throw new Error('Invalid WHERE clause in DELETE statement');
        }
        
        const whereField = whereCondition[0].trim();
        let whereValue = whereCondition[1].trim();
        
        // Handle parameterized query
        if (whereValue === '?' && values && values.length > 0) {
          whereValue = values[0];
        }
        
        // Count records before deletion
        const initialCount = this.tables[tableName].records.length;
        
        // Delete matching records
        this.tables[tableName].records = this.tables[tableName].records.filter(
          record => String(record[whereField]).toLowerCase() !== String(whereValue).toLowerCase()
        );
        
        // Count deleted records
        const deletedCount = initialCount - this.tables[tableName].records.length;
        
        // Persist the updated table
        this.saveTableData(tableName, this.tables[tableName].records);
        
        return [{ affectedRows: deletedCount }] as any;
      }
      
      throw new Error(`Unsupported SQL operation in query: ${queryString}`);
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }

  // Helper to extract field names from INSERT statement
  private extractFieldsFromInsert(query: string): string[] {
    const match = query.match(/\(([^)]+)\)/);
    if (match && match[1]) {
      return match[1].split(',').map(field => field.trim());
    }
    return [];
  }

  // Helper to create record from values
  private createRecordFromValues(fields: string[], values: any[]): any {
    const record: Record<string, any> = {};
    fields.forEach((field, index) => {
      record[field] = values[index];
    });
    return record;
  }

  // Helper to parse SET clause in UPDATE statement
  private parseSetClause(setClause: string, values?: any[]): Record<string, any> {
    const result: Record<string, any> = {};
    const assignments = setClause.split(',').map(assignment => assignment.trim());
    
    let valueIndex = 0;
    
    assignments.forEach(assignment => {
      const parts = assignment.split('=');
      if (parts.length === 2) {
        const field = parts[0].trim();
        let value = parts[1].trim();
        
        // Handle parameterized value
        if (value === '?' && values && valueIndex < values.length) {
          value = values[valueIndex++];
        }
        
        result[field] = value;
      }
    });
    
    return result;
  }

  // Higher-level methods using the query engine
  async findUserByEmail(email: string) {
    const result = await this.query<any>('SELECT * FROM users WHERE email = ?', [email]);
    return result.length > 0 ? result[0] : null;
  }

  async createUser(userData: any) {
    // Check if email already exists
    const existingUser = await this.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Generate ID if not provided
    if (!userData.id) {
      userData.id = `${userData.role || 'user'}-${Date.now()}`;
    }

    // Add timestamp
    userData.created_at = new Date().toISOString();

    // Create fields and values arrays
    const fields = Object.keys(userData);
    const values = Object.values(userData);
    
    // Execute insert query
    await this.query(
      `INSERT INTO users (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`,
      values
    );

    return userData;
  }

  async getAllUsers() {
    return await this.query<any>('SELECT * FROM users');
  }

  async saveApplication(applicationData: any) {
    // Generate ID if not provided
    if (!applicationData.id) {
      applicationData.id = `app-${Date.now()}`;
    }

    // Add timestamps
    applicationData.created_at = new Date().toISOString();
    applicationData.updated_at = new Date().toISOString();

    // Create fields and values arrays
    const fields = Object.keys(applicationData);
    const values = Object.values(applicationData);
    
    // Execute insert query
    await this.query(
      `INSERT INTO applications (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`,
      values
    );

    return applicationData;
  }

  async getApplicationsByUserId(userId: string) {
    return await this.query<any>('SELECT * FROM applications WHERE user_id = ?', [userId]);
  }

  async saveDocument(documentData: any) {
    // Generate ID if not provided
    if (!documentData.id) {
      documentData.id = `doc-${Date.now()}`;
    }

    // Add timestamps
    documentData.uploaded_at = new Date().toISOString();

    // Create fields and values arrays
    const fields = Object.keys(documentData);
    const values = Object.values(documentData);
    
    // Execute insert query
    await this.query(
      `INSERT INTO documents (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`,
      values
    );

    return documentData;
  }

  async getDocumentsByUserId(userId: string) {
    return await this.query<any>('SELECT * FROM documents WHERE user_id = ?', [userId]);
  }

  async recordPayment(paymentData: any) {
    // Generate ID if not provided
    if (!paymentData.id) {
      paymentData.id = `pay-${Date.now()}`;
    }

    // Add timestamps
    paymentData.payment_date = new Date().toISOString();

    // Create fields and values arrays
    const fields = Object.keys(paymentData);
    const values = Object.values(paymentData);
    
    // Execute insert query
    await this.query(
      `INSERT INTO payments (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`,
      values
    );

    return paymentData;
  }

  async getPaymentsByUserId(userId: string) {
    return await this.query<any>('SELECT * FROM payments WHERE user_id = ?', [userId]);
  }
}

// Create and export a singleton instance
export const db = new DatabaseService({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'erp_system'
});

