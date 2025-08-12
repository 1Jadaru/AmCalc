// Test script to check projects API after login
const testProjectsAPI = async () => {
  try {
    console.log('=== Testing Projects API ===');

    // Step 1: Login to get authentication cookies
    console.log('1. Logging in...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'demo@amcalc.com',
        password: 'demo123'
      }),
      credentials: 'include' // Important: include cookies
    });

    if (!loginResponse.ok) {
      console.error('Login failed:', loginResponse.status);
      const loginData = await loginResponse.text();
      console.error('Login error:', loginData);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful for user:', loginData.data.user.email);

    // Extract the access token from login response for header-based auth test
    const accessToken = loginData.data.token;
    console.log('🎫 Access token received');

    // Step 2: Test GET projects (should return empty array for new user)
    console.log('\n2. Testing GET /api/projects with cookies...');
    const getResponse = await fetch('http://localhost:3000/api/projects', {
      method: 'GET',
      credentials: 'include' // Use cookies for authentication
    });

    console.log('GET Response status:', getResponse.status);
    const getData = await getResponse.text();
    console.log('GET Response body:', getData);

    if (getResponse.ok) {
      const parsedData = JSON.parse(getData);
      console.log('✅ GET projects successful, found:', parsedData.count, 'projects');
    }

    // Step 3: Test POST to create a project
    console.log('\n3. Testing POST /api/projects...');
    const createResponse = await fetch('http://localhost:3000/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Use cookies for authentication
      body: JSON.stringify({
        name: 'Test Project from API',
        description: 'This is a test project created via API'
      })
    });

    console.log('POST Response status:', createResponse.status);
    const createData = await createResponse.text();
    console.log('POST Response body:', createData);

    if (createResponse.ok) {
      const parsedData = JSON.parse(createData);
      console.log('✅ Project created successfully:', parsedData.data.project.name);
    }

    // Step 4: Test with Authorization header instead of cookies
    console.log('\n4. Testing with Authorization header...');
    const headerResponse = await fetch('http://localhost:3000/api/projects', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    });

    console.log('Header auth Response status:', headerResponse.status);
    const headerData = await headerResponse.text();
    console.log('Header auth Response body:', headerData);

  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

testProjectsAPI();
