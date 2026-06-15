import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from 'recharts';

const VisionFlow = () => {
  const [goals, setGoals] = useState([
    { id: 1, title: 'Launch SaaS Product', description: 'Build and launch a productivity app', progress: 65, category: 'Business', priority: 'High', dueDate: '2024-12-31', status: 'In Progress', milestones: [{ id: 1, title: 'MVP Development', completed: true }, { id: 2, title: 'Beta Testing', completed: true }, { id: 3, title: 'Marketing Setup', completed: false }, { id: 4, title: 'Launch', completed: false }] },
    { id: 2, title: 'Learn TypeScript', description: 'Master TypeScript for better development', progress: 40, category: 'Learning', priority: 'Medium', dueDate: '2024-09-30', status: 'In Progress', milestones: [{ id: 1, title: 'Basics', completed: true }, { id: 2, title: 'Advanced Types', completed: false }, { id: 3, title: 'Build Project', completed: false }] },
    { id: 3, title: 'Run 5K', description: 'Improve fitness and complete 5K race', progress: 75, category: 'Health', priority: 'Medium', dueDate: '2024-08-15', status: 'In Progress', milestones: [{ id: 1, title: 'Training Start', completed: true }, { id: 2, title: 'Build Endurance', completed: true }, { id: 3, title: 'Race Day', completed: false }] },
  ]);

  const [newGoal, setNewGoal] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const categories = ['Business', 'Learning', 'Health', 'Personal', 'Finance'];
  const colors = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981', Business: '#3b82f6', Learning: '#8b5cf6', Health: '#ec4899', Personal: '#14b8a6', Finance: '#f97316' };

  // Calculate statistics
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.progress === 100).length;
  const avgProgress = Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length);
  const onTrackGoals = goals.filter(g => g.status === 'In Progress').length;

  // Progress data for chart
  const progressData = goals.map(g => ({ name: g.title.substring(0, 10), value: g.progress }));

  // Category breakdown
  const categoryData = categories.map(cat => ({
    name: cat,
    value: goals.filter(g => g.category === cat).length
  })).filter(c => c.value > 0);

  // AI Insights (simulated)
  const getInsight = () => {
    const insights = [
      `You're making great progress! ${avgProgress}% average completion across your goals. Keep it up! 🚀`,
      `Focus on your highest priority goals first. You have ${goals.filter(g => g.priority === 'High').length} high-priority items.`,
      `You have ${completedGoals} completed goal(s). That's ${Math.round((completedGoals / totalGoals) * 100)}% of your total!`,
      'Break larger goals into smaller milestones for better momentum and motivation.',
      `Your most active category: ${categoryData.length > 0 ? categoryData[0].name : 'Balanced'}`
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      const goal = {
        id: Math.max(...goals.map(g => g.id), 0) + 1,
        title: newGoal,
        description: '',
        progress: 0,
        category: 'Personal',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Not Started',
        milestones: [
          { id: 1, title: 'Get Started', completed: false },
          { id: 2, title: 'Build Momentum', completed: false },
          { id: 3, title: 'Finish Strong', completed: false }
        ]
      };
      setGoals([...goals, goal]);
      setNewGoal('');
      setShowForm(false);
    }
  };

  const updateProgress = (id, progress) => {
    setGoals(goals.map(g => g.id === id ? { ...g, progress: Math.min(100, Math.max(0, progress)), status: progress === 100 ? 'Completed' : 'In Progress' } : g));
  };

  const toggleMilestone = (goalId, milestoneId) => {
    setGoals(goals.map(g => g.id === goalId ? {
      ...g,
      milestones: g.milestones.map(m => m.id === milestoneId ? { ...m, completed: !m.completed } : m)
    } : g));
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ color: 'white', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>Vision Flow</h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, margin: 0 }}>Transform your aspirations into reality</p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Goals', value: totalGoals, icon: '🎯' },
            { label: 'Completed', value: completedGoals, icon: '✅' },
            { label: 'Avg Progress', value: `${avgProgress}%`, icon: '📈' },
            { label: 'On Track', value: onTrackGoals, icon: '🚀' }
          ].map((stat, idx) => (
            <div key={idx} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>{stat.label}</div>
              <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#667eea' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          {/* Charts */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: 'bold' }}>Progress Overview</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#667eea" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: 'bold' }}>Goals by Category</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name} (${value})`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'][index % 5]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Coaching Insight */}
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '2rem' }}>💡</div>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>AI Coaching Insight</h3>
              <p style={{ margin: 0, opacity: 0.95 }}>{getInsight()}</p>
            </div>
          </div>
        </div>

        {/* Add Goal Form */}
        {showForm && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: 'bold' }}>New Goal</h2>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="What do you want to achieve?"
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
              <button
                onClick={addGoal}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Create
              </button>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#f0f0f0',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Goals List */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>Your Goals</h2>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                style={{
                  padding: '0.5rem 1.25rem',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                + New Goal
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {goals.map(goal => (
              <div
                key={goal.id}
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  background: selectedGoal?.id === goal.id ? '#f8f9ff' : 'white'
                }}
                onClick={() => setSelectedGoal(selectedGoal?.id === goal.id ? null : goal)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 'bold' }}>{goal.title}</h3>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>{goal.description}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span style={{ background: colors[goal.category], color: 'white', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>{goal.category}</span>
                    <span style={{ background: colors[goal.priority], color: 'white', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>{goal.priority}</span>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Progress</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#667eea' }}>{goal.progress}%</span>
                  </div>
                  <div style={{ background: '#e0e0e0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                      height: '100%',
                      width: `${goal.progress}%`,
                      transition: 'width 0.3s'
                    }} />
                  </div>
                </div>

                {selectedGoal?.id === goal.id && (
                  <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '1rem', marginTop: '1rem' }}>
                    {/* Progress Slider */}
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Update Progress</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={goal.progress}
                        onChange={(e) => updateProgress(goal.id, parseInt(e.target.value))}
                        style={{ width: '100%', cursor: 'pointer' }}
                      />
                    </div>

                    {/* Milestones */}
                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', fontWeight: 'bold' }}>Milestones</h4>
                      <div style={{ display: 'grid', gap: '0.5rem' }}>
                        {goal.milestones.map(m => (
                          <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '6px', background: '#f8f9fa' }}>
                            <input
                              type="checkbox"
                              checked={m.completed}
                              onChange={() => toggleMilestone(goal.id, m.id)}
                              style={{ cursor: 'pointer' }}
                            />
                            <span style={{ textDecoration: m.completed ? 'line-through' : 'none', color: m.completed ? '#999' : '#333' }}>{m.title}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: '#ff4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      Delete Goal
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', color: 'white', marginTop: '2rem', fontSize: '0.9rem', opacity: 0.8 }}>
          <p>Vision Flow © 2024 | Transform aspirations into reality</p>
        </div>
      </div>
    </div>
  );
};

export default VisionFlow;
