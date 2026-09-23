/**
 * Configuration for KKDGMS Project
 * NEVER add service-role key here
 */
const config = {
    supabase: {
        url: 'https://kymsjrxjfmloibcbages.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5bXNqcnhqZm1sb2liY2JhZ2VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMTg5NzcsImV4cCI6MjA5NDU5NDk3N30.yXqibP86VDsJ0gW48cJ0yjixgYGpljesLsiqe93K4OA'
    },
    firebase: {
        apiKey: 'AIzaSyBSyMx_ozuq0IBS0J6b22vx45HOyTvJfJw',
        authDomain: 'kkdgmschool.firebaseapp.com',
        projectId: 'kkdgmschool',
        storageBucket: 'kkdgmschool.firebasestorage.app',
        messagingSenderId: '1091598835673',
        appId: '1:1091598835673:web:0b613f8750669ac0e403c8',
        vapidKey: 'BFBXhwctSdcN-RWHdI__kdX98tVjVwSf0333n3131x7MteABahcUTq4UJHD4zm1id27XjS9OMPX1dPOF6SXTeuM'
    },
    app: {
        name: 'KANYAKUMARI DIST GOVERNMENT MODEL SCHOOL',
        shortName: 'KKDGMS',
        establishedYear: 2023,
        currentYear: new Date().getFullYear()
    },
    roles: {
        ADMIN: 'ADMIN',
        FACULTY: 'FACULTY',
        STUDENT: 'STUDENT',
        WARDEN: 'WARDEN',
        TECHNICIAN: 'TECHNICIAN',
        GUEST: 'GUEST'
    },
    classes: [9, 10, 11, 12],
    sections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    groups: {
        '9-10': ['NO GROUP'],
        '11-12': ['BIO COMPUTER SCIENCE', 'MATHS COMPUTER SCIENCE', 'HUMANITIES', 'ACCOUNTANCY']
    },
    attendance: {
        maxFailedAttempts: 3,
        lockoutMinutes: 5
    },
    stories: {
        durations: [15, 20, 30],
        validHours: 24
    },
    storage: {
        buckets: {
            photos: 'photos',
            documents: 'documents',
            stories: 'stories',
            events: 'events'
        }
    }
};

export default Object.freeze(config);
