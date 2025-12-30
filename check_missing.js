const fs = require('fs');

try {
    const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    
    // Get all existing IDs
    const existingIds = data.map(item => item.question_id).sort((a, b) => a - b);
    
    if (existingIds.length === 0) {
        console.log('No questions found in data.json');
        process.exit(0);
    }

    const minId = existingIds[0];
    const maxId = existingIds[existingIds.length - 1];
    const missingIds = [];

    // Check for gaps in the sequence
    for (let i = minId; i <= maxId; i++) {
        if (!existingIds.includes(i)) {
            missingIds.push(i);
        }
    }

    console.log('--- Missing Questions Report ---');
    console.log(`Total questions found: ${data.length}`);
    console.log(`ID range: ${minId} to ${maxId}`);
    
    if (missingIds.length > 0) {
        console.log(`\nFound ${missingIds.length} missing IDs in the sequence:`);
        // Group consecutive missing IDs for cleaner output
        let ranges = [];
        let start = missingIds[0];
        let prev = missingIds[0];

        for (let i = 1; i < missingIds.length; i++) {
            if (missingIds[i] !== prev + 1) {
                ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
                start = missingIds[i];
            }
            prev = missingIds[i];
        }
        ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
        
        console.log(ranges.join(', '));
    } else {
        console.log('\nNo missing IDs found in the sequence.');
    }

} catch (err) {
    console.error('Error reading or parsing data.json:', err);
}
