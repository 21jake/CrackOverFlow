<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeTopicColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('topics', function (Blueprint $table) {
            $table->dropColumn('post_id');
        });
        // Schema::table('posts', function (Blueprint $table) {
        //     $table->bigInteger('topic_id')->unsigned()->index();
        //     $table->foreign('topic_id')->references('id')->on('topics');
        // });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
