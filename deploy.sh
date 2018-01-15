#!/bin/sh

printf "Please answer the following prompts or press [Ctrl+C] to cancel at any time\n"
printf "===========================================================================\n\n"
printf "Are you... 1) backing up your development files or,\n"
printf "           2) deploying your current build?\n"
printf "(press 1 or 2 then [Enter]): "
read MODE
printf "What branch are you pushing to? "
read BRANCH
printf "What commit message would you like to use? "
read MESSAGE
printf "===========================================================================\n"

if [ -n "$MODE" ] && [ -n "$BRANCH" ] && [ -n "$MESSAGE" ]; then
  if [ "$MODE" = "1" ]; then
    gulp clean
    git add .
    git commit -m "$MESSAGE"
    git push origin $BRANCH
  elif [ "$MODE" = "2" ]; then
    printf "What branch are pushing from? "
    read CURRENT
    printf "Is this your first time deploying to the $BRANCH branch? (y/n) "
    read DEPLOY

    if [ -n "$CURRENT" ] && [ -n DEPLOY ]; then
      if [ "$DEPLOY" = "y" ] || [ "$DEPLOY" = "Y" ]; then
        gulp clean
        gulp build
        gulp clean:temp
        git add _dist
        git commit -m "$MESSAGE"
        git subtree push --prefix _dist origin $BRANCH
      elif [ "$DEPLOY" = "n" ] || [ "$DEPLOY" = "N" ]; then
        gulp clean
        gulp build
        gulp clean:temp
        git add _dist
        git commit -m "$MESSAGE"
        git push origin `git subtree split --prefix=_dist $CURRENT`:$BRANCH --force
      else
        echo "Sorry. Invalid Input. Please Try Again."
      fi
    else
      echo "Sorry. Invalid Input. Please Try Again."
    fi
  else
    echo "Sorry. Invalid Input. Please Try Again."
  fi
else
  echo "Sorry. Invalid Input. Please Try Again."
fi
