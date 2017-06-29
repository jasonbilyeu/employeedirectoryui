node {
  // Mark the code checkout 'stage'....
  stage 'Checkout'

  // Checkout code from repository and update any submodules
  checkout scm 

  stage 'Build'

  //npm install and test
  sh "npm test"

  stage 'Stage Archive'
  junit allowEmptyResults: true, testResults: '**/test_out/*.xml'
}
