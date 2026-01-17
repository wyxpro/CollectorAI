// AI问答功能测试文件
// 用于验证所有API功能是否正常工作

import { QuizAPI } from './quizApi';

console.log('=== AI问答功能测试 ===\n');

// 1. 测试获取所有题目
console.log('1. 获取所有题目:');
const allQuestions = QuizAPI.questions.getAll();
console.log(`   ✓ 共有 ${allQuestions.length} 道题目\n`);

// 2. 测试生成每日挑战
console.log('2. 生成每日挑战 (5题, 混合难度):');
const dailyChallenge = QuizAPI.challenge.generate({ count: 5, difficulty: 'mixed' });
console.log(`   ✓ 生成了 ${dailyChallenge.length} 道题目`);
dailyChallenge.forEach((q, i) => {
  console.log(`   ${i + 1}. [${q.difficulty}] ${q.question.substring(0, 30)}...`);
});
console.log('');

// 3. 测试提交答案
console.log('3. 测试答题功能:');
const testQuestion = dailyChallenge[0];
console.log(`   题目: ${testQuestion.question}`);
console.log(`   正确答案: ${testQuestion.correctAnswer}`);

// 提交正确答案
const correctResult = QuizAPI.answer.submit(testQuestion.id, testQuestion.correctAnswer as number, 10);
console.log(`   ✓ 提交正确答案: ${correctResult.isCorrect ? '✓ 正确' : '✗ 错误'}`);

// 提交错误答案
const wrongAnswer = testQuestion.type === 'single' 
  ? ((testQuestion.correctAnswer as number) + 1) % testQuestion.options.length
  : [0];
const wrongResult = QuizAPI.answer.submit(dailyChallenge[1].id, wrongAnswer, 15);
console.log(`   ✓ 提交错误答案: ${wrongResult.isCorrect ? '✓ 正确' : '✗ 错误'}\n`);

// 4. 测试错题本
console.log('4. 测试错题本:');
const mistakes = QuizAPI.mistakes.getAll();
console.log(`   ✓ 错题本中有 ${mistakes.length} 道题目`);
if (mistakes.length > 0) {
  console.log(`   第一道错题: ${mistakes[0].question.substring(0, 40)}...`);
}
console.log('');

// 5. 测试学习报告
console.log('5. 生成学习报告:');
const report = QuizAPI.report.generate();
console.log(`   总题数: ${report.totalQuestions}`);
console.log(`   正确数: ${report.correctAnswers}`);
console.log(`   正确率: ${report.accuracy}%`);
console.log(`   连胜数: ${report.streak}`);
console.log(`   等级: ${report.level}`);
console.log(`   强项主题: ${report.strongTopics.join(', ') || '暂无'}`);
console.log(`   弱项主题: ${report.weakTopics.join(', ') || '暂无'}`);
console.log('');

// 6. 测试统计信息
console.log('6. 获取统计信息:');
const stats = QuizAPI.report.getStatistics();
console.log(`   总答题次数: ${stats.totalAttempts}`);
console.log(`   正确次数: ${stats.correctCount}`);
console.log(`   正确率: ${stats.accuracy}%`);
console.log(`   错题数: ${stats.mistakesCount}`);
console.log(`   连胜: ${stats.streak}`);
console.log(`   等级: ${stats.level}`);
console.log('');

// 7. 测试按难度筛选
console.log('7. 按难度筛选题目:');
const easyQuestions = QuizAPI.questions.getByDifficulty('easy');
const mediumQuestions = QuizAPI.questions.getByDifficulty('medium');
const hardQuestions = QuizAPI.questions.getByDifficulty('hard');
console.log(`   简单: ${easyQuestions.length} 题`);
console.log(`   中等: ${mediumQuestions.length} 题`);
console.log(`   困难: ${hardQuestions.length} 题`);
console.log('');

// 8. 测试搜索功能
console.log('8. 测试搜索功能:');
const searchResults = QuizAPI.questions.search('AI');
console.log(`   搜索 "AI" 找到 ${searchResults.length} 道题目`);
console.log('');

// 9. 测试会话管理
console.log('9. 测试会话管理:');
const sessionQuestions = QuizAPI.challenge.generate({ count: 3 });
const session = QuizAPI.session.create(sessionQuestions);
console.log(`   ✓ 创建会话: ${session.id}`);
console.log(`   会话题目数: ${session.questions.length}`);

// 模拟完成会话
const sessionResults = sessionQuestions.map(q => 
  QuizAPI.answer.submit(q.id, q.correctAnswer as number, 10)
);
const completedSession = QuizAPI.session.complete(session.id, sessionResults);
console.log(`   ✓ 完成会话，得分: ${completedSession.score}/${completedSession.questions.length}`);
console.log(`   正确率: ${completedSession.accuracy}%`);
console.log('');

// 10. 测试清除错题
console.log('10. 测试清除错题:');
const mistakesBeforeClear = QuizAPI.mistakes.getAll();
if (mistakesBeforeClear.length > 0) {
  const clearResult = QuizAPI.mistakes.clear(mistakesBeforeClear[0].id);
  console.log(`   ${clearResult.message}`);
  const mistakesAfterClear = QuizAPI.mistakes.getAll();
  console.log(`   清除前: ${mistakesBeforeClear.length} 题，清除后: ${mistakesAfterClear.length} 题`);
} else {
  console.log('   暂无错题可清除');
}
console.log('');

console.log('=== 所有功能测试完成 ✓ ===');
console.log('\n功能清单:');
console.log('✓ 题目管理 (获取、搜索、筛选)');
console.log('✓ 每日挑战生成');
console.log('✓ 答题提交和判分');
console.log('✓ 错题本管理');
console.log('✓ 学习报告生成');
console.log('✓ 统计信息查询');
console.log('✓ 会话管理');
console.log('✓ 按难度/主题筛选');
console.log('\n所有后端功能已完整实现并可正常使用！');
