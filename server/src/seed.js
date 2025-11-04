require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { connectDB } = require('./utils/db')
const User = require('./models/User')
const Event = require('./models/Event')

async function seed() {
  await connectDB()
  console.log('🌱 Seeding database...')
  
  // Clear existing data
  await User.deleteMany({})
  await Event.deleteMany({})

  // Create users with hashed passwords
  const passA = await bcrypt.hash('password123', 10)
  const passB = await bcrypt.hash('password123', 10)
  const passC = await bcrypt.hash('password123', 10)

  const userA = await User.create({ name: 'Alice Johnson', email: 'alice@example.com', passwordHash: passA })
  const userB = await User.create({ name: 'Bob Smith', email: 'bob@example.com', passwordHash: passB })
  const userC = await User.create({ name: 'Carol Williams', email: 'carol@example.com', passwordHash: passC })

  // Create diverse events with realistic times
  const now = new Date()
  
  // Alice's events
  const aliceEvents = [
    {
      title: 'Team Meeting',
      startTime: new Date(now.getTime() + 24*60*60*1000), // Tomorrow
      endTime: new Date(now.getTime() + 24*60*60*1000 + 60*60*1000), // +1 hour
      status: 'SWAPPABLE',
      ownerId: userA._id
    },
    {
      title: 'Client Presentation',
      startTime: new Date(now.getTime() + 2*24*60*60*1000), // Day after tomorrow
      endTime: new Date(now.getTime() + 2*24*60*60*1000 + 2*60*60*1000), // +2 hours
      status: 'BUSY',
      ownerId: userA._id
    },
    {
      title: 'Code Review Session',
      startTime: new Date(now.getTime() + 3*24*60*60*1000), // 3 days
      endTime: new Date(now.getTime() + 3*24*60*60*1000 + 90*60*1000), // +1.5 hours
      status: 'SWAPPABLE',
      ownerId: userA._id
    }
  ]

  // Bob's events
  const bobEvents = [
    {
      title: 'Focus Block - Deep Work',
      startTime: new Date(now.getTime() + 24*60*60*1000 + 3*60*60*1000), // Tomorrow + 3 hours
      endTime: new Date(now.getTime() + 24*60*60*1000 + 5*60*60*1000), // +2 hours
      status: 'SWAPPABLE',
      ownerId: userB._id
    },
    {
      title: 'One-on-One with Manager',
      startTime: new Date(now.getTime() + 2*24*60*60*1000 + 2*60*60*1000), // Day after + 2 hours
      endTime: new Date(now.getTime() + 2*24*60*60*1000 + 3*60*60*1000), // +1 hour
      status: 'BUSY',
      ownerId: userB._id
    },
    {
      title: 'Design Workshop',
      startTime: new Date(now.getTime() + 4*24*60*60*1000), // 4 days
      endTime: new Date(now.getTime() + 4*24*60*60*1000 + 3*60*60*1000), // +3 hours
      status: 'SWAPPABLE',
      ownerId: userB._id
    },
    {
      title: 'Sprint Planning',
      startTime: new Date(now.getTime() + 5*24*60*60*1000), // 5 days
      endTime: new Date(now.getTime() + 5*24*60*60*1000 + 2*60*60*1000), // +2 hours
      status: 'SWAPPABLE',
      ownerId: userB._id
    }
  ]

  // Carol's events
  const carolEvents = [
    {
      title: 'Product Strategy Meeting',
      startTime: new Date(now.getTime() + 24*60*60*1000 + 6*60*60*1000), // Tomorrow + 6 hours
      endTime: new Date(now.getTime() + 24*60*60*1000 + 7*60*60*1000), // +1 hour
      status: 'SWAPPABLE',
      ownerId: userC._id
    },
    {
      title: 'User Research Interview',
      startTime: new Date(now.getTime() + 3*24*60*60*1000 + 4*60*60*1000), // 3 days + 4 hours
      endTime: new Date(now.getTime() + 3*24*60*60*1000 + 5*60*60*1000), // +1 hour
      status: 'BUSY',
      ownerId: userC._id
    },
    {
      title: 'Marketing Collaboration',
      startTime: new Date(now.getTime() + 6*24*60*60*1000), // 6 days
      endTime: new Date(now.getTime() + 6*24*60*60*1000 + 90*60*1000), // +1.5 hours
      status: 'SWAPPABLE',
      ownerId: userC._id
    }
  ]

  // Insert all events
  const allEvents = [...aliceEvents, ...bobEvents, ...carolEvents]
  await Event.insertMany(allEvents)

  console.log('✅ Seed completed successfully!')
  console.log('\n📋 Test Users Created:')
  console.log('   Alice Johnson: alice@example.com / password123')
  console.log('   Bob Smith: bob@example.com / password123')
  console.log('   Carol Williams: carol@example.com / password123')
  
  console.log('\n📅 Sample Events Created:')
  console.log(`   ${aliceEvents.length} events for Alice`)
  console.log(`   ${bobEvents.length} events for Bob`)
  console.log(`   ${carolEvents.length} events for Carol`)
  
  const swappableCount = allEvents.filter(e => e.status === 'SWAPPABLE').length
  console.log(`   ${swappableCount} events marked as SWAPPABLE`)
  
  console.log('\n🚀 You can now test the application with realistic data!')
  
  mongoose.connection.close()
}

seed().catch(err => { 
  console.error('❌ Seed failed:', err)
  process.exit(1) 
})
