package main

import (
	"fmt"
	"net/http"

	"github.com/gin-contrib/cors" // Why do we need this package?
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"

	_ "github.com/jinzhu/gorm/dialects/sqlite" // If you want to use mysql or any other db, replace this line
)

var db *gorm.DB // declaring the db globally
var err error
var err2 error

type User struct {
	ID       uint   `json:"id"`
	Username string `json:"username" gorm:"unique"`
	Email    string `json:"email" gorm:"unique"`
	Password string `json:"password"`
}

type LoginJSON struct {
	User     string `json:"username"`
	Password string `json:"password"`
}

type Genre struct {
	ID         uint   `json:"id"`
	Genre      string `json:"genreName" gorm:"unique"`
	NoOfQuizes int    `json:"noOfQuiz"`
}
type Question struct {
	ID           uint   `json:"id"`
	Genre        string `json:"genreName"`
	QuizNo       int    `json:"QuizNo"`
	QuestionType string `json:"QuestionType"`
	Question     string `json:"Question"`
	Option1      string `json:"Option1"`
	Option2      string `json:"Option2"`
	Option3      string `json:"Option3"`
	Option4      string `json:"Option4"`
	Answer       string `json:"Answer"`
	Answer1      bool   `json:"Answer1"`
	Answer2      bool   `json:"Answer2"`
	Answer3      bool   `json:"Answer3"`
	Answer4      bool   `json:"Answer4"`
}
type LeaderBoard struct {
	ID           uint   `json:"id"`
	Genre        string `json:"genreName"`
	QuizNo       int    `json:"QuizNo"`
	QuestionType string `json:"QuestionType"`
	Username     string `json:"User"`
	Score        int    `json:"Score"`
}

var genre = []Genre{
	Genre{1, "GK", 2},
	Genre{2, "Movies", 2},
}
var question = []Question{
	Question{1, "GK", 1, "single", "Former Australian captain Mark Taylor has had several nicknames over his playing career. Which of the following was NOT one of them?", "Tubby", "Stodge", "Helium Bat", "Stumpy", "4", false, false, false, false},
	Question{2, "GK", 1, "single", "Which was the 1st non Test playing country to beat India in an international match?", "Canada", "Sri Lanka", "Zimbabwe", "East Africa", "2", false, false, false, false},
	Question{3, "GK", 2, "single", "Track and field star Carl Lewis won how many gold medals at the 1984 Olympic games?", "Two", "Three", "Four", "Eight", "3", false, false, false, false},
	Question{4, "GK", 2, "single", "Which county did Ravi Shastri play for?", "Glamorgan", "Leicestershire", "Gloucestershire", "Lancashire", "1", false, false, false, false},
	Question{5, "GK", 1, "multiple", "The members of the Rajya Sabha are not elected by", "the people", "Lok Sabha", "elected members of the legislative assembly", "elected members of the legislative council", "1", true, true, false, true},
	Question{6, "GK", 1, "multiple", "The power to decide an election petition is not vested in the", "Parliament", "Supreme Court", "High courts", "Election Commision", "1", true, true, false, true},
	Question{7, "GK", 1, "multiple", "The pension of a high court judge is not charged to the", "Consolidated Fund of India", "Consolidated Fund of the state where he last served", "Consolidated Funds of the different states where he has served", "Contingency Fund of India", "1", false, true, true, true},
	Question{8, "GK", 2, "multiple", "The members of a State Commission can not be removed by the", "governor on a report by the Supreme Court", "governor on a resolution passed by Parliament", "president on a report by the Supreme Court", "president on a resolution passed by Parliament", "1", true, true, false, true},
	Question{9, "GK", 2, "multiple", "Where will the AIBA Women’s World Boxing Championships not be held from 13-25 November 2018?", "New Delhi, India", "Kuala Lampur, Malaysia", "Karachi, Pakistan", "Dhaka, Bangladesh", "1", false, true, true, true},
	Question{10, "GK", 2, "single", "Who was the first Indian to win the World Amateur Billiards title?", "Geet Sethi", "Wilson Jones", "Michael Ferreira", "Manoj Kothari", "2", false, false, false, false},
	Question{11, "Movies", 1, "multiple", "Which of the following are Amitabh Bachhan's movie ?", "Sholay", "Sharaabi", "Sooryavansham", "Kaabil", "1", true, true, true, false},
	Question{12, "Movies", 1, "multiple", "Which of the following are Hrithik Roshan's movie ?", "Dhoom-2", "Sholay", "Bang Bang", "Kaabil", "1", true, false, true, true},
	Question{13, "Movies", 1, "single", "What are John Abraham and Akshay Kumar's professions in Garam Masala?", "Reporters", "Phoyographers", "Professors", "Lawyers", "2", false, false, false, false},
	Question{14, "Movies", 1, "single", "From where does Veeru propose to Basanti in Sholay?", "Top of a roof", "Top of a ladder", "Top of a hill", "Top of a water tank", "4", false, false, false, false},
	Question{15, "Movies", 1, "single", "Who, apart from Aamir Khan, wants to marry Preity Zinta in Dil Chahta Hai?", "Shah Rukh Khan", "Ayub Khan", "Saif Ali Khan", "Akshaye Khanna", "2", false, false, false, false},
	Question{16, "Movies", 2, "multiple", "Which of the following are Sanjay Dutt's movie ?", "Khalnayak", "Sooryavansham", "Policegiri", "Sholay", "1", true, false, true, false},
	Question{17, "Movies", 2, "multiple", "Which of the following are Kajol's movie ?", "Duplicate", "Baazigar", "Gulab Gang", "Ishq", "1", false, true, false, true},
	Question{18, "Movies", 2, "multiple", "Which of the following are Juhi Chawla's movie ?", "Ishq", "Darr", "Phir Bhi Dil Hai Hindustani", "Bhootnath", "1", true, true, true, true},
	Question{19, "Movies", 2, "single", "Who plays the blind friend in the 1964 Dosti?", "Mohan", "Dinu", "Ramu", "Shamu", "1", false, false, false, false},
	Question{20, "Movies", 2, "single", "In Harry Potter, who plays Nearly Headless Nick in the movie?", "Nicholas Cage", "John Hurt", "John Cleese", "Nick Nolte", "3", false, false, false, false},
}

func main() {
	db, err = gorm.Open("sqlite3", "./gorm.db")
	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()

	db.AutoMigrate(&User{}, Genre{}, Question{}, LeaderBoard{})

	for i := 0; i < 2; i++ {
		db.Create(&genre[i])
	}

	for i := 0; i < 20; i++ {
		db.Create(&question[i])
	}

	r := gin.Default()

	r.GET("/user/", GetUser)                       // Creating routes for each functionality
	r.GET("/leaderboard/:genre/:quizno", GetBoard) // Creating routes for each functionality
	r.GET("/previousQuiz/:user", GetPrevious)      // Creating routes for each functionality
	r.DELETE("/delete/:id", DeleteUser)            // Creating routes for each functionality
	r.GET("/genre/", GetGenre)                     // Creating routes for each functionality
	r.POST("/creategenre", CreateGenre)
	r.POST("/addques", AddQuestion)
	r.POST("/signup", SignUp)
	r.POST("/login", Login)
	r.GET("/questions/:genre/:quizno/:questype", GetQuestions)
	r.POST("/addtoboard", AddResult)

	//r.PUT("/people/:id", UpdatePerson)
	r.Use((cors.Default()))
	r.Run(":8080") // Run on port 8080
}

func SignUp(c *gin.Context) {
	c.Header("access-control-allow-origin", "*")

	var user User
	var user2 User
	c.BindJSON(&user)

	err := db.Where("username = ?", user.Username).First(&user2).Error
	err2 := db.Where("email = ?", user.Email).First(&user2).Error
	if err != nil && err2 != nil {
		db.Create(&user)
		c.JSON(200, user)
	} else {
		c.AbortWithStatus(404)
		fmt.Println(err)
	}
}

func Login(c *gin.Context) {

	c.Header("access-control-allow-origin", "*")

	var user User
	var temp User

	c.BindJSON(&user)
	fmt.Printf("%s %s", user.Username, user.Password)
	err := db.Where("username = ? and password = ?", user.Username, user.Password).First(&temp).Error
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "unsuccessful authentication"})
	} else {
		c.JSON(http.StatusOK, gin.H{"message": "authentication successful"})
	}

}

func CreateGenre(c *gin.Context) {
	var genre Genre
	var temp Genre
	c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
	c.BindJSON(&genre)
	err := db.Where("genre = ?", genre.Genre).First(&temp).Error
	if err == nil {
		c.JSON(304, genre)
	} else {
		db.Create(&genre)
		c.JSON(201, genre)
	}
}
func AddQuestion(c *gin.Context) {
	var question Question
	c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
	c.BindJSON(&question)
	db.Create(&question)
	c.JSON(201, question)
}

func GetGenre(c *gin.Context) {
	var genre []Genre
	err := db.Find(&genre).Error
	if err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, genre)
	}
}

func GetUser(c *gin.Context) {
	var user []User
	if err := db.Find(&user).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, user)
	}
}
func GetBoard(c *gin.Context) {
	genreName := c.Params.ByName("genre")
	quizno := c.Params.ByName("quizno")
	var board []LeaderBoard
	db.Where("genre=? and quiz_no=?", genreName, quizno).Order("score desc").Find(&board)
	c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
	c.JSON(200, board)
}
func GetPrevious(c *gin.Context) {
	user := c.Params.ByName("user")
	var board []LeaderBoard
	db.Where("username=?", user).Find(&board)
	c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
	c.JSON(200, board)
}
func GetQuestions(c *gin.Context) {
	fmt.Printf("check\n")
	genreName := c.Params.ByName("genre")
	quizno := c.Params.ByName("quizno")
	questype := c.Params.ByName("questype")
	fmt.Println(genreName)
	var question []Question
	err := db.Where("genre=? and quiz_no=? and question_type=?", genreName, quizno, questype).Find(&question).Error
	c.Header("access-control-allow-origin", "*")

	if err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.JSON(200, question)
	}
}
func AddResult(c *gin.Context) {
	var result LeaderBoard
	c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
	c.BindJSON(&result)
	db.Create(&result)
	c.JSON(201, result)
}

func DeleteUser(c *gin.Context) {
	id := c.Params.ByName("id")
	var user User
	d := db.Where("id = ?", id).Delete(&user)
	fmt.Println(d)
	c.Header("access-control-allow-origin", "*")
	c.JSON(200, gin.H{"id #" + id: "deleted"})
}

// func UpdatePerson(c *gin.Context) {
// 	var person Person
// 	id := c.Params.ByName("id")
// 	if err := db.Where("id = ?", id).First(&person).Error; err != nil {
// 		c.AbortWithStatus(404)
// 		fmt.Println(err)
// 	}
// 	c.BindJSON(&person)
// 	db.Save(&person)
// 	c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
// 	c.JSON(200, person)
// }
